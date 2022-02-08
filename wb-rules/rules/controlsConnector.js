// // Модуль для связи реальных контролов с виртуальным устройством

// var config = readConfig('etc/wb-rules/links.conf')

// function makeLink(virtualTopic, realTopic) {
//     defineRule({
//         whenChanged: realTopic,
//         then: function(newValue, devName, cellName) {
//             dev[virtualTopic] = newValue
//         }
//     })
// }

// for (var key in config) {
//     dev[key] = dev[config[key]]
//     makeLink(key, config[key])
// }
