var PATH_TO_CONFIG = '/etc/wb-rules/virtualCond/config.conf'

var config = readConfig(PATH_TO_CONFIG)
var sendingInterval = config['sendingInterval']

defineVirtualDevice('virtualCond', {
    title: 'Virtual conditioner',
    cells: {
        Mode: {
            type: 'text',
            value: 'OFF',
            readonly: false,
            order: 1,
        },
        Temperature: {
            type: 'temperature',
            value: dev[config['tempSensor']],
            readonly: true,
            order: 2,
        },
    }
})

function sendCommand(command) {
    var commands = config['commands']
    var device = config['type']

    if (command in commands) {
        value = true

        if (command === 'OFF' && device === 'Relay') {
            value = !value
        }

        dev[commands[command]] = value
        log.debug('Command "{}" sent to air conditioner', command)
    } else {
        log.warning('Command "{}" not found in {}', command, PATH_TO_CONFIG)
    }
}

defineRule('virtualCondMode', {
    whenChanged: 'virtualCond/Mode',
    then: sendCommand
})

defineRule('virtualCondTemp', {
    whenChanged: config['tempSensor'],
    then: function(newValue) {
        dev['virtualCond/Temperature'] = newValue
    }
})

if (sendingInterval !== 0) {
    setInterval(function() { sendCommand(dev['virtualCond/Mode']) }, sendingInterval)
}
