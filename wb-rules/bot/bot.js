var PATH_TO_CONFIG = '/etc/wb-rules/bot/config.conf';
var config = readConfig(PATH_TO_CONFIG);

var message;
var token = config['token'];
var chatId = config['chatId'];
var messageThreadId = config['messageThreadId'];
var fireAlarmTopic = 'virtualFireDetector/fire';
var doorAlarmTopic = 'virtualDoor/Door';
var acAlarmTopic = 'virtualACdetector/AC_alarm';
var city = config['city'];
var generator = config['generator'];
var tBoxLowTopic = 'alarm/low_temp';
var tBoxHighTopic = 'alarm/high_temp';

function checkAlarm() {
    var command = 'curl -s -X POST https://api.telegram.org/bot{}/sendMessage -d chat_id={} -d message_thread_id={} -d text={}'.format(token, chatId, messageThreadId, message);
runShellCommand(command);
}

if (doorAlarmTopic) {
  var doorAlarmRule = defineRule("door", {
   whenChanged: doorAlarmTopic,
    then: function () {
      message = dev[doorAlarmTopic] ? "Дверь\\ открыта!" : "Дверь\\ закрыта!";
      checkAlarm()
    }
  });
  runRule(doorAlarmRule)
}
if (city) {
  var acAlarmRule = defineRule("AC", {
   whenChanged: acAlarmTopic,
    then: function () {
      if (dev[city] == true & dev[acAlarmTopic] == true) {
        message = "Отклонение\\ напряжения\\ городской\\ сети";
      } else if (dev[city] == false) {
        message = "Электричество\\ кончилось!";
      } else message = "Питание\\ в\\ норме!";
      checkAlarm()
    }
  });
  runRule(acAlarmRule)
}
if (fireAlarmTopic) {
  var fireAlarmRule = defineRule("fire", {
    whenChanged: fireAlarmTopic,
    then: function () {
      message = dev[fireAlarmTopic]? "Пожар!" : '';
      checkAlarm()
    }
  });
  runRule(fireAlarmRule)
}
if (tBoxLowTopic) {
  var tBoxLowRule = defineRule("lowTemp", {
    whenChanged: tBoxLowTopic,
    then: function () {
        message = dev[tBoxLowTopic] ? "Холодно!!!" : 'Температура\\ в\\ норме!';
      checkAlarm()
      }
  });
  runRule(tBoxLowRule)
}
if (tBoxHighTopic) {
  var tBoxHighRule = defineRule("highTemp", {
    whenChanged: tBoxHighTopic,
    then: function () {
        message = dev[tBoxHighTopic] ? "Жарко!!!" : 'Температура\\ в\\ норме!';
      checkAlarm()
      }
  });
  runRule(tBoxHighRule)
}
