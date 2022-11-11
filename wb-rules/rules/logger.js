defineRule('virtualControllerSwitchLogger', {
    whenChanged: [
        'virtualController/Manual_control',
        'virtualController/FAN_present',
        'virtualController/FAN',
        'virtualController/Heater_present',
        'virtualController/Heater',
        'virtualController/WinKit_present',
        'virtualController/WinKit'
    ],
    then: function(newValue, devName, cellName) {
        if (['FAN', 'Heater', 'WinKit'].indexOf(cellName) != -1) {
            log.info('{}:::{} {} in {} mode', devName, cellName, newValue ? 'ON' : 'OFF', 
            dev['virtualController/Manual_control'] ? 'manual' : 'automatic')
        } else {
            log.info('{}:::{} {}', devName, cellName, newValue ? 'ON' : 'OFF')
        }
    }
})

defineRule('virtualControllerSetpointLogger', {
    whenChanged: [
        'virtualController/tIN_cooling',
        'virtualController/tIN_cooling_delta',
        'virtualController/tIN_overheat',
        'virtualController/tIN_overheat_delta',
        'virtualController/tIN_heating',
        'virtualController/tIN_heating_delta',
        'virtualController/tOUT_winKit',
        'virtualController/tOUT_winKit_delta',
        'virtualController/tOUT_switching',
        'virtualController/tOUT_switching_delta',
        'virtualController/Humidity_threshold',
        'virtualController/Humidity_threshold_delta'
    ],
    then: function(newValue, devName, cellName) {
        log.info('{}:::new setpoint: {} = {}', devName, cellName, newValue)
    }
})

defineRule('virtualDoorLogger', {
    whenChanged: [
        'virtualDoor/Door_present',
        'virtualDoor/Door',
        'virtualDoor/Door_1',
        'virtualDoor/Door_2'
    ],
    then: function(newValue, devName, cellName) {
        if (cellName == 'Door_present') {
            log.info('{}:::{} {}', devName, cellName, newValue ? 'ON' : 'OFF')
        } else {
            log.warning('{}:::{} alarm {}', devName, cellName, newValue ? 'detected' : 'cleared')
        }
    }
})
