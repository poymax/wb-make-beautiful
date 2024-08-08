var DEVICE_ID = 'virtualACdetector'
var DEVICE_TITLE = 'Virtual AC detector'
var PATH_TO_CONFIG = '/etc/wb-rules/virtualACdetector/config.conf'

var device = dev[DEVICE_ID]
var config = readConfig(PATH_TO_CONFIG)

var voltageParams = config.voltage
var inputParams = [config.input1, config.input2, config.input3]
var inputVoltages = ['Input_1_voltage', 'Input_2_voltage', 'Input_3_voltage']

var virtualDevice = defineVirtualDevice(DEVICE_ID, {
    title: DEVICE_TITLE,
    cells: {
        AC_alarm: { type: 'alarm', value: false, readonly: false, order: 1 },
        Input_1_alarm: { type: 'alarm', value: false, readonly: false, order: 2 },
        Input_2_alarm: { type: 'alarm', value: false, readonly: false, order: 3 },
        Input_3_alarm: { type: 'alarm', value: false, readonly: false, order: 4 },
        Voltage: { type: 'voltage', value: 0, readonly: true, order: 5 },
        Input_1_voltage: { type: 'voltage', value: 0, readonly: true, order: 6 },
        Input_2_voltage: { type: 'voltage', value: 0, readonly: true, order: 7 },
        Input_3_voltage: { type: 'voltage', value: 0, readonly: true, order: 8 },
        Generator: { type: 'switch', value: false, readonly: true, order: 9 },
        ATS_1: { type: 'switch', value: false, readonly: true, order: 10 },
        ATS_2: { type: 'switch', value: false, readonly: true, order: 11 },
        ATS_3: { type: 'switch', value: false, readonly: true, order: 12 },
    },
})

var controlMap = {
    Generator: config.generator[0],
    Voltage: voltageParams.topic,
    Input_1_voltage: config.input1.topic,
    Input_2_voltage: config.input2.topic,
    Input_3_voltage: config.input3.topic,
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

function checkVoltage(voltage, params, isAlarmActive) {
    var thresholdMin = params.min + (isAlarmActive ? params.delta : 0)
    var thresholdMax = params.max - (isAlarmActive ? params.delta : 0)

    return voltage >= thresholdMin && voltage <= thresholdMax
}

function checkPower() {
    var generatorDisabled = !device.Generator
    var voltageIsOk = checkVoltage(device.Voltage, voltageParams, device.AC_alarm)

    var inputIsOk = false
    for (var i = 0; i < inputParams.length; i++) {
        if (virtualDevice.isControlExists(inputVoltages[i]) &&
            checkVoltage(device[inputVoltages[i]], inputParams[i], device['Input_' + i + '_alarm'])) {
            inputIsOk = true
            break
        }
    }

    return generatorDisabled && voltageIsOk && inputIsOk
}

function setAlarm() {
    device.AC_alarm = !checkPower()
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
