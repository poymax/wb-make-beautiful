var PATH_TO_CONFIG = '/etc/wb-rules/virtualACdetector/configV2.conf'
var config = readConfig(PATH_TO_CONFIG)

var voltageMin = config['voltageMin']
var voltageMax = config['voltageMax']
var voltageTopic = config['voltage']
var generatorTopic = config['generator']
var input1Topic = config['input1']
var input2Topic = config['input2']
var input3Topic = config['input3']
var ATS1Topic = config['ATS1']
var ATS2Topic = config['ATS2']
var ATS3Topic = config['ATS3']

var topicMap = {
    'virtualACdetectorV2/Generator': generatorTopic,
    'virtualACdetectorV2/Voltage': voltageTopic,
    'virtualACdetectorV2/Input_1': input1Topic,
    'virtualACdetectorV2/ATS_1': ATS1Topic,
    'virtualACdetectorV2/Input_2': input2Topic,
    'virtualACdetectorV2/ATS_2': ATS2Topic,
    'virtualACdetectorV2/Input_3': input3Topic,
    'virtualACdetectorV2/ATS_3': ATS3Topic,
}

var observedTopics = []
for (var virtualTopic in topicMap) {
    var realTopic = topicMap[virtualTopic]
    if (realTopic) {
        dev[virtualTopic] = dev[realTopic]
        observedTopics.push(realTopic)
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
    return voltage >= voltageMin && voltage <= voltageMax
}

function checkInputs() {
    var input1IsNormal = input1Topic && (input2Topic ? ATS1Topic : true) && dev[input1Topic] && (input2Topic ? dev[ATS1Topic] : true)
    var input2IsNormal = input2Topic && ATS2Topic && dev[input2Topic] && dev[ATS2Topic]
    var input3IsNormal = input3Topic && ATS3Topic && dev[input3Topic] && dev[ATS3Topic]

    return (input1IsNormal || input2IsNormal || input3IsNormal) && checkVoltage(dev[voltageTopic])
}

function setAlarm() {
    dev['virtualACdetectorV2/AC_alarm'] = !checkInputs()
}

defineRule({
    whenChanged: observedTopics,
    then: function(newValue, devName, cellName) {
        dev[getKeyByValue(topicMap, devName + '/' + cellName)] = newValue
        setAlarm()
    }
})

setAlarm()
