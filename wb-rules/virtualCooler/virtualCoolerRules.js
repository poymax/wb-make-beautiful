var PATH_TO_CONFIG = '/etc/wb-rules/virtualCooler/config.conf'

var config = readConfig(PATH_TO_CONFIG)

var cooler1 = config['cooler1']
var cooler2 = config['cooler2']

var sendingInterval1 = cooler1['sendingInterval']
var sendingInterval2 = cooler2['sendingInterval']

function secondCoolerControls(enabled) {
    var device = getDevice('virtualCooler')
    if (enabled) {
        device.addControl('Cooler2_mode', {
            type: 'text',
            value: 'OFF',
            readonly: false,
            order: 4,
        })
        device.addControl('Cooler2_temperature', {
            type: 'temperature',
            value: 0,
            readonly: true,
            order: 5,
        })
        device.addControl('Delta', {
            type: 'temperature',
            value: 0,
            readonly: false,
            order: 6,
        })
        device.addControl('Cooler1', {
            type: 'text',
            value: cooler1['name'],
            readonly: true,
            order: 7,
        })
        device.addControl('Cooler2', {
            type: 'text',
            value: cooler2['name'],
            readonly: true,
            order: 8,
        })
    } else {
        device.removeControl('Cooler2_mode')
        device.removeControl('Cooler2_temperature')
        device.removeControl('Delta')
        device.removeControl('Cooler1')
        device.removeControl('Cooler2')
    }
}

function sendCommand(device, command) {
    var deviceName = device['name']
    var deviceType = device['type']
    var commands = device['commands']

    if (command in commands) {
        value = true

        if (command === 'OFF' && deviceType === 'relay') {
            value = !value
        }

        dev[commands[command]] = value
        log.debug('Command "{}" sent to {}', command, deviceName)
    } else {
        log.warning('Command "{}" not found in {}', command, deviceName)
    }
}

defineRule('cooler1Mode', {
    whenChanged: 'virtualCooler/Mode',
    then: function(newValue) {
        sendCommand(cooler1, newValue)
    }
})

if (cooler1['tempSensor'])
    defineRule('cooler1Temp', {
        whenChanged: cooler1['tempSensor'],
        then: function(newValue) {
            dev['virtualCooler/Temperature'] = newValue
        }
    })

defineRule('cooler2Present', {
    whenChanged: 'virtualCooler/Cooler2_present',
    then: function(newValue) {
        secondCoolerControls(newValue)
    }
})

defineRule('cooler2Mode', {
    whenChanged: 'virtualCooler/Cooler2_mode',
    then: function(newValue) {
        sendCommand(cooler2, newValue)
    }
})

if (cooler2['tempSensor']) {
    defineRule('cooler2Temp', {
        whenChanged: cooler2['tempSensor'],
        then: function(newValue) {
            dev['virtualCooler/Cooler2_temperature'] = newValue
        }
    })
}

if (cooler2) {
    defineRule('coolerRotation', {
        when: cron(config['cronRotationRule']),
        then: function () {
            if (dev['virtualCooler/Cooler2_present']) {
                cooler2 = [cooler1, cooler1 = cooler2][0];
                dev['virtualCooler/Cooler1'] = cooler1['name']
                dev['virtualCooler/Cooler2'] = cooler2['name']
                log.info('virtualCooler:::Cooler has rotated. Now cooler 1: {}, cooler 2: {}', cooler1['name'], cooler2['name'])
            }
        }
    });
}

secondCoolerControls(dev['virtualCooler/Cooler2_present'])

if (sendingInterval1 !== 0) {
    setInterval(function() { sendCommand(cooler1, dev['virtualCooler/Mode']) }, sendingInterval1)
}

if (sendingInterval2 !== 0) {
    setInterval(function() { sendCommand(cooler2, dev['virtualCooler/Cooler2_mode']) }, sendingInterval2)
}
