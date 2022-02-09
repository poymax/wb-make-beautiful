// Правила при пожарной тревоге

var permissions = require('rulesPermissions')

defineRule('fire', {
    whenChanged: 'controlRoom/Fire',
    
    then: function(enabled) {
        log.warning('Fire {}'.format(enabled ? 'detected' : 'eliminated'))
        
        if (enabled) {
            dev['controlRoom/Heater'] = false
            dev['controlRoom/Conditioner'] = false
            log.info('Heater is OFF')
        }

        try {
            permissions.setRulePermission('Heater', !enabled)
            permissions.setRulePermission('Cooler', !enabled)
            log.info('Heater rules {}'.format(enabled ? 'disabled' : 'enabled'))
            log.info('Cooler rules {}'.format(enabled ? 'disabled' : 'enabled'))
        } catch (e) {
            log.error(e)
        }
    }
})
