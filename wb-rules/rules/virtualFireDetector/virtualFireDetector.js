var PATH_TO_CONFIG = '/etc/wb-rules/virtualFireDetector/config.conf'

var config = readConfig(PATH_TO_CONFIG)

var detector1RealTopic = config['fireDetector1']
var detector2RealTopic = config['fireDetector2']
var invertDetector1 = config['invertDetector1']
var invertDetector2 = config['invertDetector2']

var fireAlarmTopic = 'virtualFireDetector/Fire'
var detector1VirtualTopic = 'virtualFireDetector/Detector_1'
var detector2VirtualTopic = 'virtualFireDetector/Detector_2'
var detectorPresentTopic = 'virtualFireDetector/Fire_detector_present'

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
    dev[fireAlarmTopic] = dev[detector1VirtualTopic] && dev[detector2VirtualTopic] && dev[detectorPresentTopic]
}

if (detector1RealTopic) {
    var virtualDetector1Rule = defineRule('virtualDetector1', {
        whenChanged: detector1RealTopic,
        then: function() {
            dev[detector1VirtualTopic] = invertDetector1 ? !dev[detector1RealTopic] : dev[detector1RealTopic]
            checkFireAlarm()
        }
    })
    runRule(virtualDetector1Rule)
}

if (detector2RealTopic) {
    var virtualDetector2Rule = defineRule('virtualDetector2', {
        whenChanged: detector2RealTopic,
        then: function() {
            dev[detector2VirtualTopic] = invertDetector2 ? !dev[detector2RealTopic] : dev[detector2RealTopic]
            checkFireAlarm()
        }
    })
    runRule(virtualDetector2Rule)
}

defineRule('checkFireDetectorPresent', {
    whenChanged: detectorPresentTopic,
    then: checkFireAlarm
})

checkFireAlarm()
