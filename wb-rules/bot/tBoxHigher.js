var tBox = 'virtualController/tIN';
var tBoxOverheat = 'virtualController/tIN_overheat';
var tBoxOverheatDelta = 'virtualController/tIN_overheat_delta'; 
var tBoxAlarm = 'alarm/high_temp';

defineVirtualDevice('alarm', {
  title: 'box alarm temperature',
  cells: {
    high_temp: {
      type: 'alarm',
      value: false,
      readonly: false,
      forceDefault: false,
      order: 1
    },
  }
})

function setTempAlarm(status) {
  dev[tBoxAlarm] = status
}

function checkTboxAlarm(value) {
  if (value > dev[tBoxOverheat]) {
     setTempAlarm(true) 
    }
    if (value < (dev[tBoxOverheat] - dev[tBoxOverheatDelta])) {
      setTempAlarm(false)
    } 
}

defineRule('virtualTboxAlarm', {
  whenChanged: tBox,
  then: function (newValue) {
    checkTboxAlarm(newValue)    
  }
})