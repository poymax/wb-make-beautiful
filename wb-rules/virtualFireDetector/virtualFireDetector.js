var DEVICE_ID = 'virtualFireDetector'
var DEVICE_TITLE = 'Virtual fire detector'
var PATH_TO_CONFIG = '/etc/wb-rules/virtualFireDetector/config.conf'

var config = readConfig(PATH_TO_CONFIG)

var virtualDevice = defineVirtualDevice(DEVICE_ID, {
    title: DEVICE_TITLE,
    cells: {
        Fire_alarm: {
            type: 'alarm',
            value: false,
            readonly: false,
            order: 1,
        },
        Detector_1: {
            type: 'alarm',
            value: false,
            readonly: false,
            order: 2,
        },
        Detector_2: {
            type: 'alarm',
            value: false,
            readonly: false,
            order: 3,
        },
    },
})

var controlMap = {
    'Detector_1': config['detector1'][0],
    'Detector_2': config['detector2'][0],
}

var invertMap = {
    'Detector_1': config['detector1'][1],
    'Detector_2': config['detector2'][1],
}

var observedTopics = []
for (var virtualControl in controlMap) {
    var realTopic = controlMap[virtualControl]

    if (realTopic) {
        dev[DEVICE_ID][virtualControl] = invertMap[virtualControl] ? !dev[realTopic] : dev[realTopic]
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

function checkFireAlarm() {
    var detector1Exists = virtualDevice.isControlExists('Detector_1');
    var detector2Exists = virtualDevice.isControlExists('Detector_2');

    if (!detector1Exists && !detector2Exists) {
        return false;
    }

    if (detector1Exists && detector2Exists) {
        return dev[DEVICE_ID]['Detector_1'] && dev[DEVICE_ID]['Detector_2'];
    }

    if (detector1Exists) {
        return dev[DEVICE_ID]['Detector_1'];
    }

    if (detector2Exists) {
        return dev[DEVICE_ID]['Detector_2'];
    }
}

function setAlarm() {
    dev[DEVICE_ID]['Fire_alarm'] = checkFireAlarm()
}

defineRule({
    whenChanged: observedTopics,
    then: function(newValue, devName, cellName) {
        var virtualControl = getKeyByValue(controlMap, devName + '/' + cellName)
        dev[DEVICE_ID][virtualControl] = invertMap[virtualControl] ? !newValue : newValue
        setAlarm()
    }
})

setAlarm()
