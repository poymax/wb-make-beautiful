var fullPowerTopic = 'wb-map6s_24/P 1'
var cool1PowerTopic = 'wb-map6s_24/P 3'
var cool2PowerTopic = 'wb-map6s_24/d 4'
var fanCurrentTopic = 'wb-map6s_24/Irms 2'

var fixPowerFanEnableTopic = 'Out_temp_calc/Fix_power_fan'
var fanPowerValueTopic = 'Out_temp_calc/Fan_power'
var vFanValueTopic = 'Out_temp_calc/V_fan'
var outTempTopic = 'Out_temp_calc/t_out'

var tInTopic = 'virtualController/tIN_cooling'
var fanTopic = 'virtualController/FAN'

function fixPowerFan(enabled) {
    var device = getDevice('Out_temp_calc')

    if (enabled) {
        device.addControl('Fan_power', {
            type: 'value',
            value: '50',
            readonly: false,
            order: 2,
        })
    } else {
        device.removeControl('Fan_power')
    }

    setOutTemp()
}

function setOutTemp() {
    fanCurrentFormula = dev[fanTopic] ? (dev[fixPowerFanEnableTopic] ? dev[fanPowerValueTopic] : dev[fanCurrentTopic] * 220) : 0
    dev[outTempTopic] = Math.floor(dev[tInTopic] - ((dev[fullPowerTopic] - dev[cool1PowerTopic] - dev[cool2PowerTopic] - fanCurrentFormula) / 1000 / (dev[vFanValueTopic] / 1.1 / 3600) * 1.2 * 1.02))
}

defineRule('recalcOutTemp', {
    whenChanged: [
        fullPowerTopic,
        fanPowerValueTopic,
        vFanValueTopic,
    ],
    then: setOutTemp,
})

defineRule('fixPowerFan', {
    whenChanged: fixPowerFanEnableTopic,
    then: fixPowerFan,
})

fixPowerFan(dev[fixPowerFanEnableTopic])
