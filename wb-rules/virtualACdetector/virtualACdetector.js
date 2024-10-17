var DEVICE_ID = 'virtualACdetector';
var DEVICE_TITLE = 'Virtual AC detector';
var PATH_TO_CONFIG = '/etc/wb-rules/virtualACdetector/config.conf';

var TOPIC_AC_ALARM = 'AC_alarm';
var TOPIC_VOLTAGE = 'Voltage';
var TOPIC_INPUT_1 = 'Input_1';
var TOPIC_INPUT_2 = 'Input_2';
var TOPIC_INPUT_3 = 'Input_3';
var TOPIC_GENERATOR = 'Generator';
var TOPIC_ATS_1 = 'ATS_1';
var TOPIC_ATS_2 = 'ATS_2';
var TOPIC_ATS_3 = 'ATS_3';

var device = dev[DEVICE_ID];
var config = readConfig(PATH_TO_CONFIG);

var voltageIsOk = true;
var input1IsOk = true;
var input2IsOk = true;
var input3IsOk = true;

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
});

var controlMap = {
  Generator: config.generator[0],
  Voltage: config.voltage.topic,
  Input_1: config.input1.topic,
  Input_2: config.input2.topic,
  Input_3: config.input3.topic,
  ATS_1: config.ATS1[0],
  ATS_2: config.ATS2[0],
  ATS_3: config.ATS3[0],
};

var invertMap = {
  Generator: config.generator[1],
  ATS_1: config.ATS1[1],
  ATS_2: config.ATS2[1],
  ATS_3: config.ATS3[1],
};

var observedTopics = [];

for (var virtualControl in controlMap) {
  var realTopic = controlMap[virtualControl];

  if (realTopic) {
    device[virtualControl] = invertMap[virtualControl] ? !dev[realTopic] : dev[realTopic];
    observedTopics.push(realTopic);
  } else {
    virtualDevice.removeControl(virtualControl);
  }
}

function checkVoltage(voltage, params, nowIsOk) {
  var thresholdMin = params.min + (nowIsOk ? 0 : params.delta);
  var thresholdMax = params.max - (nowIsOk ? 0 : params.delta);

  return voltage >= thresholdMin && voltage <= thresholdMax;
}

function setAlarm() {
  voltageIsOk =
    virtualDevice.isControlExists(TOPIC_VOLTAGE) &&
    checkVoltage(device[TOPIC_VOLTAGE], config.voltage, voltageIsOk);

  device[TOPIC_AC_ALARM] = !(voltageIsOk && !device.Generator);
}

function findKeyByValue(map, value) {
  for (var key in map) {
    if (map.hasOwnProperty(key) && map[key] === value) {
      return key;
    }
  }
  return null;
}

defineRule({
  whenChanged: observedTopics,
  then: function (newValue, devName, cellName) {
    var virtualControl = findKeyByValue(controlMap, devName + '/' + cellName);

    if (virtualControl) {
      device[virtualControl] = invertMap[virtualControl] ? !newValue : newValue;
    }

    setAlarm();
  },
});

setAlarm();
