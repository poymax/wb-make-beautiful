// Виртуальный кондиционер

var config = readConfig('/etc/wb-rules/virtualCond/virtualCondLinks.conf')

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
    then: function(newValue) {
        dev[config["commands"][newValue]] = 1
    }
})
