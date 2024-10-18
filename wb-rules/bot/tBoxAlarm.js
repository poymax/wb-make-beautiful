var tBox = 'virtualController/tIN';
var tBoxCold = 'virtualController/tIN_heating';
var tBoxColdDelta = 'virtualController/tIN_heating_delta';
var tBoxOverheat = 'virtualController/tIN_overheat';
var tBoxOverheatDelta = 'virtualController/tIN_overheat_delta';
var tBoxHighAlarm = 'alarm/high_temp';
var tBoxLowAlarm = 'alarm/low_temp';

defineVirtualDevice('alarm', {
  title: 'box alarm temperature',
  cells: {
      low_temp: {
      type: 'alarm',
      value: false,
      readonly: false,
      forceDefault: false,
      order: 1
    },
    high_temp: {
      type: 'alarm',
      value: false,
      readonly: false,
      forceDefault: false,
      order: 2
    }
  }
})

function checkTboxLowAlarm(value) {
  if (value < (dev[tBoxCold] - dev[tBoxColdDelta])) {
     dev[tBoxLowAlarm] = true;
    }
    if (value > dev[tBoxCold]) {
      dev[tBoxLowAlarm] = false;
    }
}

function checkTboxHighAlarm(value) {
  if (value > dev[tBoxOverheat]) {
     dev[tBoxHighAlarm] = true;
    }
    if (value < (dev[tBoxOverheat] - dev[tBoxOverheatDelta])) {
      dev[tBoxHighAlarm] = false;
    }
}

defineRule('virtualTboxAlarm', {
  whenChanged: tBox,
  then: function (newValue) {
    checkTboxLowAlarm(newValue)
    checkTboxHighAlarm(newValue)
  }
})
