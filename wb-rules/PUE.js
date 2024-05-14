defineVirtualDevice('PUE', {
    title: 'PUE',
    cells: {
        PUE: {
            type: 'value',
            value: true,
            readonly: false,
            order: 1,
        }
     },
})

var fullPowerTopic = 'wb-map6s_24/P 1'
var cool1PowerTopic = 'wb-map6s_24/P 3'
var cool2PowerTopic = 'wb-map6s_24/d 4'
var fanCurrentTopic = 'wb-map6s_24/Irms 2'
var pueTopic = 'PUE/PUE'

function PUE() {
     dev[pueTopic] = dev[fullPowerTopic] / (dev[fullPowerTopic] - dev[cool1PowerTopic] - dev[cool2PowerTopic] - (dev[fanCurrentTopic] * 220))
}

defineRule('Power', {
    whenChanged: fullPowerTopic,
    then: PUE,
})
