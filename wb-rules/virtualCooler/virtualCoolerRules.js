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
        // device.addControl('Delta', {
        //     type: 'temperature',
        //     value: 0,
        //     readonly: false,
        //     order: 6,
        // })
        device.addControl('Rotation', {
            type: 'switch',
            value: true,
            readonly: false,
            order: 7,
        })
        device.addControl('Rotate', {
            type: 'pushbutton',
            readonly: false,
            order: 8,
        })
        device.addControl('Cooler1', {
            type: 'text',
            value: cooler1['name'],
            readonly: true,
            order: 9,
        })
        device.addControl('Cooler2', {
            type: 'text',
            value: cooler2['name'],
            readonly: true,
            order: 10,
        })
        device.addControl('Last_rotation', {
            type: 'text',
            value: new Date(0).toLocaleString(),
            readonly: true,
            order: 11,
        })
        device.addControl('Last_rotation_unix', {
            type: 'value',
            units: 's',
            value: 0,
            readonly: true,
            order: 12,
        })
    } else {
        if (dev['virtualCooler/Cooler1'] !== config['cooler1']['name']) {
            doRotation()
            log.info('virtualCooler:::Default cooler config restored. Now cooler 1: {}', cooler1['name'])
        }

        device.removeControl('Cooler2_mode')
        device.removeControl('Cooler2_temperature')
        // device.removeControl('Delta')
        device.removeControl('Rotation')
        device.removeControl('Rotate')
        device.removeControl('Cooler1')
        device.removeControl('Cooler2')
        device.removeControl('Last_rotation')
        device.removeControl('Last_rotation_unix')
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
        log.debug('virtualCooler:::Command "{}" sent to {}', command, deviceName)
    } else {
        log.warning('virtualCooler:::Command "{}" not found in {}', command, deviceName)
    }
}

function updateLastRotation() {
    date = new Date()
    dev['virtualCooler/Last_rotation'] = date.toLocaleString()
    dev['virtualCooler/Last_rotation_unix'] = Math.floor(date.getTime() / 1000)
}

function doRotation() {
    cooler2 = [cooler1, cooler1 = cooler2][0]
    dev['virtualCooler/Cooler1'] = cooler1['name']
    dev['virtualCooler/Cooler2'] = cooler2['name']
    updateLastRotation()
    log.info('virtualCooler:::Cooler has been rotated. Now cooler 1: {}, cooler 2: {}', cooler1['name'], cooler2['name'])
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

defineRule('rotate', {
    whenChanged: 'virtualCooler/Rotate',
    then: doRotation,
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
            if (dev['virtualCooler/Cooler2_present'] && dev['virtualCooler/Rotation']) {
                doRotation()
            }
        }
    })
}

if (dev['virtualCooler/Cooler2_present']) {
    secondCoolerControls(true)

    if (dev['virtualCooler/Cooler1'] !== cooler1['name']) {
        doRotation()
    }
}

if (sendingInterval1 !== 0) {
    setInterval(function() { sendCommand(cooler1, dev['virtualCooler/Mode']) }, sendingInterval1)
}

if (sendingInterval2 !== 0) {
    setInterval(function() { sendCommand(cooler2, dev['virtualCooler/Cooler2_mode']) }, sendingInterval2)
}
