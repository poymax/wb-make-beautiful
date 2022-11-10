// Virtual door

var PATH_TO_CONFIG = '/etc/wb-rules/virtualDoor/config.conf'

var config = readConfig(PATH_TO_CONFIG)

defineVirtualDevice('virtualDoor', {
    title: 'Virtual door',
    cells: {
        Door_alarm: {
            type: 'alarm',
            value: false,
            readonly: false,
            order: 1,
        },
        Door_1: {
            type: 'alarm',
            value: false,
            readonly: false,
            order: 1,
        },
        Door_2: {
            type: 'alarm',
            value: false,
            readonly: false,
            order: 3,
        },
    }
})

function checkDoorsAlarm() {
    dev['virtualDoor/Door_alarm'] = dev['virtualDoor/Door_1'] || dev['virtualDoor/Door_2']
}

defineRule('virtualDoor1', {
    whenChanged: config['door1'],
    then: function (newValue) {
        dev['virtualDoor/Door_1'] = newValue
        checkDoorsAlarm()
    }
})

defineRule('virtualDoor2', {
    whenChanged: config['door2'],
    then: function (newValue) {
        dev['virtualDoor/Door_2'] = newValue
        checkDoorsAlarm()
    }
})
