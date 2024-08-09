var DEVICE_ID = 'virtualACdetector'
var DEVICE_TITLE = 'Virtual AC detector'
var PATH_TO_CONFIG = '/etc/wb-rules/virtualACdetector/config.conf'

var voltageIsOk = true
var input1IsOk = true
var input2IsOk = true
var input3IsOk = true

var device = dev[DEVICE_ID]
var config = readConfig(PATH_TO_CONFIG)

var virtualDevice = defineVirtualDevice(DEVICE_ID, {
    title: DEVICE_TITLE,
    cells: {
        AC_alarm: { type: 'alarm', value: false, readonly: false, order: 1 },
        Voltage: { type: 'voltage', value: 0, readonly: true, order: 2 },
        Input_1: { type: 'voltage', value: 0, readonly: true, order: 3 },
        Input_2: { type: 'voltage', value: 0, readonly: true, order: 4 },
        Input_3: { type: 'voltage', value: 0, readonly: true, order: 5 },
        Generator: { type: 'switch', value: false, readonly: true, order: 6 },
        ATS_1: { type: 'switch', value: false, readonly: true, order: 7 },
        ATS_2: { type: 'switch', value: false, readonly: true, order: 8 },
        ATS_3: { type: 'switch', value: false, readonly: true, order: 9 },
    },
})

var controlMap = {
    Generator: config.generator[0],
    Voltage: config.voltage.topic,
    Input_1: config.input1.topic,
    Input_2: config.input2.topic,
    Input_3: config.input3.topic,
    ATS_1: config.ATS1[0],
    ATS_2: config.ATS2[0],
    ATS_3: config.ATS3[0],
}

var invertMap = {
    Generator: config.generator[1],
    ATS_1: config.ATS1[1],
    ATS_2: config.ATS2[1],
    ATS_3: config.ATS3[1],
}

var observedTopics = []

for (var virtualControl in controlMap) {
    var realTopic = controlMap[virtualControl]

    if (realTopic) {
        device[virtualControl] = invertMap[virtualControl] ? !dev[realTopic] : dev[realTopic]
        observedTopics.push(realTopic)
    } else {
        virtualDevice.removeControl(virtualControl)
    }
}

function checkVoltage(voltage, params, nowIsOk) {
    var thresholdMin = params.min + (nowIsOk ? 0 : params.delta)
    var thresholdMax = params.max - (nowIsOk ? 0 : params.delta)

    return voltage >= thresholdMin && voltage <= thresholdMax
}

function setAlarm() {
    voltageIsOk = virtualDevice.isControlExists('Voltage') && checkVoltage(device.Voltage, config.voltage, voltageIsOk)
    input1IsOk = virtualDevice.isControlExists('Input_1') && checkVoltage(device.Input_1, config.input1, input1IsOk)
    input2IsOk = virtualDevice.isControlExists('Input_2') && checkVoltage(device.Input_2, config.input2, input2IsOk)
    input3IsOk = virtualDevice.isControlExists('Input_3') && checkVoltage(device.Input_3, config.input3, input3IsOk)

    device.AC_alarm = !(voltageIsOk && !device.Generator && (input1IsOk || input2IsOk || input3IsOk))
}

function findKeyByValue(map, value) {
    for (var key in map) {
        if (map.hasOwnProperty(key) && map[key] === value) {
            return key
        }
    }
    return null
}

defineRule({
    whenChanged: observedTopics,
    then: function (newValue, devName, cellName) {
        var virtualControl = findKeyByValue(controlMap, devName + '/' + cellName)

        if (virtualControl) {
            device[virtualControl] = invertMap[virtualControl] ? !newValue : newValue
        }

        setAlarm()
    },
})

setAlarm()
