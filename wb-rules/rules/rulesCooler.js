// Правила для управления охлаждением

var permissions = require('rulesPermissions')

defineRule('cooler', {
    whenChanged: 'controlRoom/tIN',

    then: function(newValue) {
        if (permissions.getRulePermission('Cooler')) {
            if (newValue >= dev['controlRoom/tON_COOLER']) {
                dev['controlRoom/{}'.format(dev['controlRoom/Master_cooler'])] = true
            } else if (newValue <= dev['controlRoom/tON_COOLER'] - 1) {
                dev['controlRoom/{}'.format(dev['controlRoom/Master_cooler'])] = false
            }
        }
    }
})
