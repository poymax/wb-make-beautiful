// Правила при пожарной тревоге

var permissions = require('rulesPermissions')

var fireDetected = defineRule('fireDetected', {
    when: function() {
        return dev['controlRoom/Fire']
    },
    
    then: function() {
        log.warning('Fire detected')

        if (permissions.getRulePermission('Fire')) {
            dev['controlRoom/Heater'] = false
            log.info('Heater is OFF')
        
            try {
                permissions.setRulePermission('Heater', false)
                log.info('Heater rules disabled')
            } catch (e) {
                log.error(e)
            }
        }
    }
})

var fireEliminated = defineRule('fireEliminated', {
    when: function() {
        return !dev['controlRoom/Fire']
    },

    then: function() {
        log.warning('Fire eliminated')
        
        if (permissions.getRulePermission('Fire')) {
            try {
                permissions.setRulePermission('Heater', true)
                log.info('Heater rules enabled')
            } catch (e) {
                log.error(e)
            }
        }
    }
})
