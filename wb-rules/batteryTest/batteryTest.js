var upsStatusTopic = "shtyl/Work_status";
var rackSwitchTopic = "wb-mr6cu_12/K4";

if (upsStatusTopic) {
  var upsChangeRule = defineRule ('status', {
    whenChanged: upsStatusTopic,
    then: function (newValue) {
      if (dev[upsStatusTopic] === "Тест емкости батарей") {
        dev[rackSwitchTopic] = true;
      } else dev[rackSwitchTopic] = false;
    }
  })
  runRule(upsChangeRule)
}