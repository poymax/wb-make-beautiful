// Правила для управления обогревателем

var permissions = require('rulesPermissions')

var heaterOn = defineRule('heaterOn', {
    when: function() {
        return dev['controlRoom/tIN'] <= 13
    },
    
    then: function() {
        if (permissions.getRulePermission('Heater')) {
            dev['controlRoom/Heater'] = true
            dev['controlRoom/Conditioner'] = true // Кондиционер включать в режим вентилятора
        }
    }
})

var heaterOff = defineRule('heaterOff', {
    when: function() {
        return dev['controlRoom/tIN'] >= 16
    },
    
    then: function() {
        if (permissions.getRulePermission('Heater')) {
            dev['controlRoom/Heater'] = false
            dev['controlRoom/Conditioner'] = false
        }
    }
})
