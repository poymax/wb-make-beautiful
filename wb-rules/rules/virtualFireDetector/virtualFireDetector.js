var PATH_TO_CONFIG = '/etc/wb-rules/virtualFireDetector/config.conf'

var config = readConfig(PATH_TO_CONFIG)

var fireDetector1RealTopic = config['fireDetector1']
var fireDetector2RealTopic = config['fireDetector2']
var fireAlarmTopic = 'virtualFireDetector/Fire'
var fireDetector1VirtualTopic = 'virtualFireDetector/Detector_1'
var fireDetector2VirtualTopic = 'virtualFireDetector/Detector_2'
var fireDetectorPresentTopic = 'virtualFireDetector/Fire_detector_present'

defineVirtualDevice('virtualFireDetector', {
    title: 'Virtual fire detector',
    cells: {
        Fire_detector_present: {
            type: 'switch',
            value: false,
            readonly: false,
            order: 1,
        },
        Fire: {
            type: 'alarm',
            value: false,
            readonly: false,
            forceDefault: true,
            order: 2,
        },
        Detector_1: {
            type: 'alarm',
            value: false,
            readonly: false,
            forceDefault: true,
            order: 3,
        },
        Detector_2: {
            type: 'alarm',
            value: false,
            readonly: false,
            forceDefault: true,
            order: 4,
        },
    }
})

function checkFireAlarm() {
    dev[fireAlarmTopic] = dev[fireDetector1VirtualTopic] 
                        && dev[fireDetector2VirtualTopic] 
                        && dev[fireDetectorPresentTopic]
}

if (fireDetector1RealTopic) {
    defineRule('virtualDetector1', {
        whenChanged: fireDetector1RealTopic,
        then: function(newValue) {
            dev[fireDetector1VirtualTopic] = newValue
            checkFireAlarm()
        }
    })
}

if (fireDetector2RealTopic) {
    defineRule('virtualDetector2', {
        whenChanged: fireDetector2RealTopic,
        then: function(newValue) {
            dev[fireDetector2VirtualTopic] = newValue
            checkFireAlarm()
        }
    })
}

defineRule('checkFireDetectorPresent', {
    whenChanged: fireDetectorPresentTopic,
    then: checkFireAlarm
})

checkFireAlarm()
