var PATH_TO_CONFIG = '/etc/wb-rules/virtualDoor/config.conf'

var config = readConfig(PATH_TO_CONFIG)

var door1RealTopic = config['door1']
var door2RealTopic = config['door2']
var invertDoor1 = config['invertDoor1']
var invertDoor2 = config['invertDoor2']
var doorAlarmTopic = 'virtualDoor/Door'
var door1VirtualTopic = 'virtualDoor/Door_1'
var door2VirtualTopic = 'virtualDoor/Door_2'
var doorPresentTopic = 'virtualDoor/Door_present'

defineVirtualDevice('virtualDoor', {
    title: 'Virtual door',
    cells: {
        Door_present: {
            type: 'switch',
            value: false,
            readonly: false,
            order: 1,
        },
        Door: {
            type: 'alarm',
            value: false,
            readonly: false,
            forceDefault: true,
            order: 2,
        },
        Door_1: {
            type: 'alarm',
            value: false,
            readonly: false,
            forceDefault: true,
            order: 3,
        },
        Door_2: {
            type: 'alarm',
            value: false,
            readonly: false,
            forceDefault: true,
            order: 4,
        },
    }
})

function checkDoorsAlarm() {
    dev[doorAlarmTopic] = (dev[door1VirtualTopic] || dev[door2VirtualTopic]) && dev[doorPresentTopic]
}

if (door1RealTopic) {
    var virtualDoor1Rule = defineRule('virtualDoor1', {
        whenChanged: door1RealTopic,
        then: function() {
            dev[door1VirtualTopic] = invertDoor1 ? !dev[door1RealTopic] : dev[door1RealTopic]
            checkDoorsAlarm()
        }
    })
    runRule(virtualDoor1Rule)
}

if (door2RealTopic) {
    var virtualDoor2Rule = defineRule('virtualDoor2', {
        whenChanged: door2RealTopic,
        then: function() {
            dev[door2VirtualTopic] = invertDoor2 ? !dev[door2RealTopic] : dev[door2RealTopic]
            checkDoorsAlarm()
        }
    })
    runRule(virtualDoor2Rule)
}

defineRule('checkDoorPresent', {
    whenChanged: doorPresentTopic,
    then: checkDoorsAlarm
})

checkDoorsAlarm()