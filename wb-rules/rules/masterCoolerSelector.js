// Правила для выбора ведущего охладителя

var permissions = require('rulesPermissions')
var coolerFlipped = false

defineRule('check_AC', {
    whenChanged: 'controlRoom/AC_Power',

    then: function(enabled) {
        log.warning('AC {} detected'.format(enabled ? 'ON' : 'OFF'))

        if (!enabled) {
            disableRule(check_tIN)
            disableRule(checkHumidity)
            disableRule(check_tOUT)

            dev['controlRoom/Master_cooler'] = 'FAN'
            log.info('{} selected as master cooler'.format(dev['controlRoom/Master_cooler']))
        } else {
            enableRule(check_tIN)
            enableRule(checkHumidity)
            enableRule(check_tOUT)
        }
    }
})

var check_tIN = defineRule('check_tIN', {
    whenChanged: 'controlRoom/tIN',

    then: function(newValue) {
        if (newValue >= dev['controlRoom/tIN_MAX']) {
            disableRule(checkHumidity)
            disableRule(check_tOUT)

            if (!coolerFlipped) {
                if (dev['controlRoom/Master_cooler'] == 'Conditioner') {
                    dev['controlRoom/Master_cooler'] = 'FAN'
                } else {
                    dev['controlRoom/Master_cooler'] = 'Conditioner'
                }

                coolerFlipped = true
                log.warning('tIN has reached a critical value: {} °C'.format(newValue))
                log.info('{} selected as master cooler'. format(dev['controlRoom/Master_cooler']))
            }
        }

        else {
            enableRule(checkHumidity)
            enableRule(check_tOUT)

            coolerFlipped = false
        }
    }
})

var checkHumidity = defineRule('checkHumidity', {
    whenChanged: 'controlRoom/Humidity',

    then: function(newValue) {
        if (newValue >= dev['controlRoom/Humidity_MAX']) {
            disableRule(check_tOUT)
            dev['controlRoom/Master_cooler'] = 'Conditioner'
        } else {
            enableRule(check_tOUT)
        }
    }
})

var check_tOUT = defineRule('check_tOUT', {
    whenChanged: 'controlRoom/tOUT',

    then: function(newValue) {
        if (newValue >= dev['controlRoom/tOUT_FLIP']) {
            dev['controlRoom/Master_cooler'] = 'Conditioner'
            dev['controlRoom/FAN'] = false
        } else {
            dev['controlRoom/Master_cooler'] = 'FAN'
        }
    }
})
