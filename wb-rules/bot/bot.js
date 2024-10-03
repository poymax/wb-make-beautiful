var PATH_TO_CONFIG = '/etc/wb-rules/bot/config.conf';
var config = readConfig(PATH_TO_CONFIG);

var message;
var token = config['token'];
var chatId = config['chatId'];
var messageThreadId = config['messageThreadId'];
var fireAlarmTopic = 'virtualFireDetector/Fire_alarm';
var doorAlarmTopic = 'virtualDoor/Door';
var acAlarmTopic = 'virtualACdetector/AC_alarm';
var city_1 = config['city_1'];
var city_2 = config['city_2'];
var city_3 = config['city_3'];
var cityVoltage_1 = config[cityVoltage_1];
var cityVoltage_2 = config[cityVoltage_2];
var cityVoltage_3 = config[cityVoltage_3];
var generator = config['generator'];
var upsStatus = 'shtyl/Work_status';
var tBoxTopic = 'alarm/high_temp';

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
if (acAlarmTopic) {
  var acAlarmRule = defineRule("AC", {
   whenChanged: acAlarmTopic,
    then: function () {
      if (dev[acAlarmTopic] == true) {
        message = "Электричество\\ кончилось!";
      }
      checkAlarm()
    }
  });
  runRule(acAlarmRule)
}
if (city_1) {
  var city1Rule = defineRule("AC1", {
   whenChanged: city_1,
    then: function () {
      if (dev[city_1] == true) {
        message = "Ввод\\ электропитания\\ №1:\\ активирован!\\ " + dev[cityVoltage_1];
      }
      checkAlarm()
    }
  });
  runRule(city1Rule)
}
if (city_2) {
  var city1Rule = defineRule("AC2", {
   whenChanged: city_2,
    then: function () {
      if (dev[city_2] == true) {
        message = "Ввод\\ электропитания\\ №2:\\ активирован!\\ " + dev[cityVoltage_2];
      }
      checkAlarm()
    }
  });
  runRule(city1Rule)
}
if (city_3) {
  var city1Rule = defineRule("AC3", {
   whenChanged: city_3,
    then: function () {
      if (dev[city_3] == true) {
        message = "Ввод\\ электропитания\\ №3:\\ активирован!\\ " + dev[cityVoltage_3];
      }
      checkAlarm()
    }
  });
  runRule(city1Rule)
}
if (generator) {
  var city1Rule = defineRule("gen", {
   whenChanged: generator,
    then: function () {
      message = dev[generator] ? "Генератор\\ подключен!" : "Генератор\\ отключен!";
      checkAlarm()
    }
  });
  runRule(city1Rule)
}
if (upsStatus) {
  var upsAlarmRule = defineRule("UPS", {
   whenChanged: upsStatus,
    then: function () {
      message = "Статус\\ ИБП:\\ " + dev[upsStatus];
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
if (tBoxTopic) {
  var tBoxRule = defineRule("temp", {
    whenChanged: tBoxTopic,
    then: function () {
        message = dev[tBoxTopic] ? "Жарко!!!" : 'Температура\\ в\\ норме!';
      checkAlarm()
      }
  });
  runRule(tBoxRule)
}
