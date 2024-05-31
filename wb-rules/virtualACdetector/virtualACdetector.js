var DEVICE_ID = 'virtualACdetector'
var DEVICE_TITLE = 'Virtual AC detector'
var PATH_TO_CONFIG = '/etc/wb-rules/virtualACdetector/config.conf'

var config = readConfig(PATH_TO_CONFIG)

var voltageMin = config['voltageMin']
var voltageMax = config['voltageMax']
var voltageDelta = config['voltageDelta']
var voltageTopic = config['voltage']
var generatorTopic = config['generator']
var input1Topic = config['input1']
var input2Topic = config['input2']
var input3Topic = config['input3']
var ATS1Topic = config['ATS1']
var ATS2Topic = config['ATS2']
var ATS3Topic = config['ATS3']

var virtualDevice = defineVirtualDevice(DEVICE_ID, {
    title: DEVICE_TITLE,
    cells: {
        AC_alarm: {
            type: 'alarm',
            value: false,
            readonly: false,
            order: 1,
        },
        Voltage: {
            type: 'voltage',
            value: 0,
            readonly: true,
            order: 2,
        },
        Generator: {
            type: 'switch',
            value: false,
            readonly: true,
            order: 3,
        },
        Input_1: {
            type: 'switch',
            value: false,
            readonly: true,
            order: 4,
        },
        Input_2: {
            type: 'switch',
            value: false,
            readonly: true,
            order: 5,
        },
        Input_3: {
            type: 'switch',
            value: false,
            readonly: true,
            order: 6,
        },
        ATS_1: {
            type: 'switch',
            value: false,
            readonly: true,
            order: 7,
        },
        ATS_2: {
            type: 'switch',
            value: false,
            readonly: true,
            order: 8,
        },
        ATS_3: {
            type: 'switch',
            value: false,
            readonly: true,
            order: 9,
        },
    },
})

var controlMap = {
    'Voltage': voltageTopic,
    'Generator': generatorTopic,
    'Input_1': input1Topic,
    'Input_2': input2Topic,
    'Input_3': input3Topic,
    'ATS_1': ATS1Topic,
    'ATS_2': ATS2Topic,
    'ATS_3': ATS3Topic,
}

var observedTopics = []
for (var virtualControl in controlMap) {
    var realTopic = controlMap[virtualControl]

    if (realTopic) {
        dev[DEVICE_ID][virtualControl] = dev[realTopic]
        observedTopics.push(realTopic)
    } else {
        virtualDevice.removeControl(virtualControl)
    }
}

function getKeyByValue(object, value) {
    for (var key in object) {
        if (object.hasOwnProperty(key) && object[key] === value) {
            return key
        }
    }

    return null
}

function checkVoltage(voltage) {
    var alarmIsActive = dev[DEVICE_ID]['AC_alarm']
    var min = alarmIsActive ? voltageMin + voltageDelta : voltageMin
    var max = alarmIsActive ? voltageMax - voltageDelta : voltageMax

    return voltage >= min && voltage <= max
}

function checkPower() {
    var voltageIsOk = checkVoltage(dev[DEVICE_ID]['Voltage'])
    var generatorDisabled = !dev[DEVICE_ID]['Generator']

    var input1IsOk = virtualDevice.isControlExists('Input_1') && dev[DEVICE_ID]['Input_1']
    var input2IsOk = virtualDevice.isControlExists('Input_2') && dev[DEVICE_ID]['Input_2']
    var input3IsOk = virtualDevice.isControlExists('Input_3') && dev[DEVICE_ID]['Input_3']
    var anyInputIsOk = input1IsOk || input2IsOk || input3IsOk

    return voltageIsOk && generatorDisabled && anyInputIsOk
}

function setAlarm() {
    dev[DEVICE_ID]['AC_alarm'] = !checkPower()
}

defineRule({
    whenChanged: observedTopics,
    then: function(newValue, devName, cellName) {
        dev[DEVICE_ID][getKeyByValue(controlMap, devName + '/' + cellName)] = newValue
        setAlarm()
    }
})

setAlarm()
