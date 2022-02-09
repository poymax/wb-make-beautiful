// Правила для управления обогревом дренажа

var permissions = require('rulesPermissions')

defineRule('winKit', {
    whenChanged: 'controlRoom/tOUT',
    
    then: function(newValue) {
        if (permissions.getRulePermission('WinKit')) {
            if (newValue <= 2) {
                dev['controlRoom/Win_Kit'] = true
            } else if (newValue >= 3) {
                dev['controlRoom/Win_Kit'] = false
            }
        }
    }
})
