var PATH_TO_CONFIG = '/etc/wb-rules/virtualController/config.conf'

var config = readConfig(PATH_TO_CONFIG)

if (config['tIN'] && config['tOUT'] && config['humidity']) {
    defineRule('tIN', {
        whenChanged: config['tIN'],
        then: function(newValue) {
            dev['virtualController/tIN'] = newValue
        }
    })
    
    defineRule('tOUT', {
        whenChanged: config['tOUT'],
        then: function(newValue) {
            dev['virtualController/tOUT'] = newValue
        }
    })
    
    defineRule('humidity', {
        whenChanged: config['humidity'],
        then: function(newValue) {
            dev['virtualController/Humidity'] = newValue
        }
    })
}

defineRule('manualControl', {
    whenChanged: 'virtualController/Manual_control',
    then: function(newValue) {
        getControl('virtualController/FAN').setReadonly(!newValue || !dev['virtualController/FAN_present'])
        getControl('virtualController/Heater').setReadonly(!newValue || !dev['virtualController/Heater_present'])
        getControl('virtualController/WinKit').setReadonly(!newValue || !dev['virtualController/WinKit_present'])
    }
})

defineRule('fanPresent', {
    whenChanged: 'virtualController/FAN_present',
    then: function(newValue) {
        getControl('virtualController/FAN').setReadonly(!newValue || !dev['virtualController/Manual_control'])
        if (!newValue) {
            dev['virtualController/FAN'] = false
        }
    }
})

defineRule('heaterPresent', {
    whenChanged: 'virtualController/Heater_present',
    then: function(newValue) {
        getControl('virtualController/Heater').setReadonly(!newValue || !dev['virtualController/Manual_control'])
        if (!newValue) {
            dev['virtualController/Heater'] = false
        }
    }
})

defineRule('winKitPresent', {
    whenChanged: 'virtualController/WinKit_present',
    then: function(newValue) {
        getControl('virtualController/WinKit').setReadonly(!newValue || !dev['virtualController/Manual_control'])
        if (!newValue) {
            dev['virtualController/WinKit'] = false
        }
    }
})

defineRule('fan', {
    whenChanged: 'virtualController/FAN',
    then: function(newValue) {
        dev[config['fan']] = newValue
    }
})

defineRule('heater', {
    whenChanged: 'virtualController/Heater',
    then: function(newValue) {
        dev[config['heater']] = newValue
    }
})

defineRule('winKit', {
    whenChanged: 'virtualController/WinKit',
    then: function(newValue) {
        dev[config['winKit']] = newValue
    }
})

defineRule('restartRules', {
    whenChanged: 'virtualController/Restart_rules',
    then: function() {
        runShellCommand('service wb-rules restart')
    }
})
