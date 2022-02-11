var coolerFlipped = false // Был ли переключен охладитель по перегреву
var manualControlActive = false // Активно ли ручное управление

var logger = defineRule({ // Логирование
    whenChanged: [  'controlRoom/Heater', 
                    'controlRoom/FAN',
                    'controlRoom/Conditioner', 
                    'controlRoom/Win_Kit',
                    'controlRoom/Fire_alarm', 
                    'controlRoom/AC_alarm', 
                    'controlRoom/Overheat_alarm',    
                 ],
    then: function(newValue, devName, cellName) {
        // Переделать когда контролы переедут на алармы: читать тип контрола
        if (cellName == 'Fire_alarm' || cellName == 'AC_alarm' || cellName == 'Overheat_alarm') {
            log.warning('{}: {} {}'.format(devName, cellName, newValue ? 'detected' : 'cleared'))
        } else {
            log.info('{}: {} {} in {} mode'.format(devName, cellName, newValue ? 'ON' : 'OFF', 
                                               dev['controlRoom/Manual_control'] ? 'manual' : 'automatic'))
        }
    }
})

var coolerTracker = defineRule({ // Следим, чтобы не было конфликта кондиционера и вентилятора
    whenChanged: ['controlRoom/FAN', 'controlRoom/Conditioner'],
    then: function(enabled, devName, cellName) {
        if (enabled) {
            if (cellName == 'FAN') {
                dev['controlRoom/Conditioner'] = false
            } else if (cellName == 'Conditioner') {
                dev['controlRoom/FAN'] = false
            }
        }
    }
})

var manualControl = defineRule({ // Переключение ручной/автоматический режим
    whenChanged: 'controlRoom/Manual_control',
    then: function(enabled) {
        manualControlActive = enabled
        log.warning('System switched to {} control'.format(enabled ? 'manual' : 'automatic'))

        if (enabled) {
            disableRule(fireAlarm)
            disableRule(cooler)
            disableRule(heater)
            disableRule(winKit)
            disableRule(coolerTracker)
            disableRule(acPowerOff)
            disableRule(overheat)
            disableRule(highHumidity)
            disableRule(outTemperature)

            dev['controlRoom/Overheat_alarm'] = false
        }

        else {
            runRule(fireAlarm)
            runRule(cooler)
            runRule(heater)
            runRule(winKit)
            runRule(coolerTracker)
            runRule(acPowerOff)
            runRule(overheat)
            runRule(highHumidity)
            runRule(outTemperature)

            enableRule(fireAlarm)
            enableRule(cooler)
            enableRule(heater)
            enableRule(winKit)
            enableRule(coolerTracker)
            enableRule(acPowerOff)
            enableRule(overheat)
            enableRule(highHumidity)
            enableRule(outTemperature)
        }

        getControl('controlRoom/Heater').setReadonly(!enabled)
        getControl('controlRoom/FAN').setReadonly(!enabled)
        getControl('controlRoom/Conditioner').setReadonly(!enabled)
        getControl('controlRoom/Win_Kit').setReadonly(!enabled)
    }
})

var fireAlarm = defineRule({ // Пожарная тревога
    whenChanged: 'controlRoom/Fire_alarm',
    then: function() {
        alarmRelevant = dev['controlRoom/Fire_alarm']

        if (alarmRelevant && !manualControlActive) {
            disableRule(heater)

            disableRule(acPowerOff)
            disableRule(overheat)
            disableRule(highHumidity)
            disableRule(outTemperature)

            dev['controlRoom/Master_cooler'] = 'Conditioner'

            dev['controlRoom/Heater'] = false
            dev['controlRoom/FAN'] = false
        } else {
            runRule(heater)

            runRule(acPowerOff)
            runRule(overheat)
            runRule(highHumidity)
            runRule(outTemperature)

            enableRule(heater)

            enableRule(acPowerOff)
            enableRule(overheat)
            enableRule(highHumidity)
            enableRule(outTemperature)
        }

        runRule(cooler)
    }
})

var cooler = defineRule({ // Управление охлаждением
    whenChanged: 'controlRoom/tIN',
    then: function() {
        temperature = dev['controlRoom/tIN']
        masterCooler = 'controlRoom/{}'.format(dev['controlRoom/Master_cooler'])

        if (temperature >= dev['controlRoom/tON_COOLER']) {
            dev[masterCooler] = true
        } else if (temperature <= dev['controlRoom/tON_COOLER'] - 1) {
            dev[masterCooler] = false
        }
    }
})

var heater = defineRule({ // Управление обогревателем
    whenChanged: 'controlRoom/tIN',
    then: function() {
        temperature = dev['controlRoom/tIN']
        if (temperature <= 13) {
            dev['controlRoom/Heater'] = true
        } else if (temperature >= 16) {
            dev['controlRoom/Heater'] = false
        }
    }
})

var winKit = defineRule({ // Управление обогревом дренажа кондиционера
    whenChanged: 'controlRoom/tOUT',
    then: function() {
        temperature = dev['controlRoom/tOUT']
        if (temperature <= 2) {
            dev['controlRoom/Win_Kit'] = true
        } else if (temperature >= 3) {
            dev['controlRoom/Win_Kit'] = false
        }
    }
})

// Правила, переключающие охладитель

var acPowerOff = defineRule({ // Отключение городской сети
    whenChanged: 'controlRoom/AC_alarm',
    then: function() {
        acAlarm = dev['controlRoom/AC_alarm']

        if(acAlarm) {
            disableRule(overheat)
            disableRule(highHumidity)
            disableRule(outTemperature)

            dev['controlRoom/Master_cooler'] = 'FAN'
        } else {
            coolerFlipped = false
            runRule(overheat)
            enableRule(overheat)
        }

        runRule(cooler)
    }
})

var overheat = defineRule({ // Критическая температура внутри
    whenChanged: 'controlRoom/tIN',
    then: function() {
        temperature = dev['controlRoom/tIN']
        if (temperature >= dev['controlRoom/tIN_MAX']) {
            disableRule(highHumidity)
            disableRule(outTemperature)

            dev['controlRoom/Overheat_alarm'] = true

            if (!coolerFlipped) {
                if (dev['controlRoom/Master_cooler'] == 'Conditioner') {
                    dev['controlRoom/Master_cooler'] = 'FAN'
                } else {
                    dev['controlRoom/Master_cooler'] = 'Conditioner'
                }

                coolerFlipped = true
            }

        } else if (temperature <= dev['controlRoom/tON_COOLER'] && dev['controlRoom/Overheat_alarm']) {
            dev['controlRoom/Overheat_alarm'] = false
            coolerFlipped = false

            runRule(highHumidity)
            enableRule(highHumidity)
        } else {
            runRule(highHumidity)
            enableRule(highHumidity)
        }

        runRule(cooler)
    }
})

var highHumidity = defineRule({ // Высокая влажность
    whenChanged: 'controlRoom/Humidity',
    then: function() {
        humidity = dev['controlRoom/Humidity']
        if (humidity >= dev['controlRoom/Humidity_MAX']) {
            disableRule(outTemperature)
            dev['controlRoom/Master_cooler'] = 'Conditioner'
        } else {
            runRule(outTemperature)
            enableRule(outTemperature)
        }

        runRule(cooler)
    }
})

var outTemperature = defineRule({ // По наружней температуре
    whenChanged: 'controlRoom/tOUT',
    then: function() {
        temperature = dev['controlRoom/tOUT']
        if (temperature >= dev['controlRoom/tOUT_FLIP']) {
            dev['controlRoom/Master_cooler'] = 'Conditioner'
        } else {
            dev['controlRoom/Master_cooler'] = 'FAN'
        }

        runRule(cooler)
    }
})
