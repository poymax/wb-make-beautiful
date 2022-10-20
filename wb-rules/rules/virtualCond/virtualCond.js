// Виртуальный кондиционер

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

var conditioner = defineRule({
    whenChanged: 'virtualCond/mode',
    then: function(command) {
        commands = config['commands']

        if (command in commands) {
            dev[commands[command]] = true
        } else {
            log.warning('Command "{}" not found in {}', command, PATH_TO_CONFIG)
        }
    }
})
