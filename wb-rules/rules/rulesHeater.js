// Правила для управления обогревателем

var permissions = require('rulesPermissions')

defineRule('heater', {
    whenChanged: 'controlRoom/tIN',
    
    then: function(newValue) {
        if (permissions.getRulePermission('Heater')) {
            if (newValue <= 13) {
                dev['controlRoom/Heater'] = true
                dev['controlRoom/Conditioner'] = true // Кондиционер в режим вентилятора
            } else if (newValue >= 16) {
                dev['controlRoom/Heater'] = false
                dev['controlRoom/Conditioner'] = false
            }
        }
    }
})
