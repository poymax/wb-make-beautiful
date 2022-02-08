// Правила для управления обогревом дренажа

var permissions = require('rulesPermissions')

var winKitOn = defineRule('winKitOn', {
    when: function() {
        return dev['controlRoom/tOUT'] <= 2
    },
    
    then: function() {
        if (permissions.getRulePermission('WinKit')) {
            dev['controlRoom/Win_Kit'] = true
        }
    }
})

var winKitOff = defineRule('winKitOff', {
    when: function() {
        return dev['controlRoom/tOUT'] >= 3
    },
    
    then: function() {
        if (permissions.getRulePermission('WinKit')) {
            dev['controlRoom/Win_Kit'] = false
        }
    }
})
