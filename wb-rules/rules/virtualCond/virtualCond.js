// Виртуальный кондиционер

// TODO: перечитывать конфиг
// TODO: датчик температуры у выдува

var PATH_TO_CONFIG = '/etc/wb-rules/virtualCond/virtualCondLinks.conf'

var config = readConfig(PATH_TO_CONFIG)

defineVirtualDevice('virtualCond', {
    title: 'Virtual Conditioner',
    cells: {
        mode: {
            type: 'text',
            value: '',
            readonly: false,
            order: 1,
        }
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

defineRule("virtual_conditioner", {
    whenChanged: 'virtualCond/mode',
    then: sendCommand
})

setInterval(function() { sendCommand(dev['virtualCond/mode']) }, 60000);
