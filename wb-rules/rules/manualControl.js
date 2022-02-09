// Правила для перевода системы на ручное/автоматическое управление

var permissions = require('rulesPermissions')

defineRule('manualControl', {
    whenChanged: 'controlRoom/Manual_control',

    then: function(enabled) {
        try {
            permissions.setAllPermissions(!enabled)
            log.warning('System switched to {} control'.format(enabled ? 'manual' : 'automatic'))
        } catch (e) {
            log.error(e)
        }

        getControl('controlRoom/Heater').setReadonly(!enabled)
        getControl('controlRoom/FAN').setReadonly(!enabled)
        getControl('controlRoom/Conditioner').setReadonly(!enabled)
        getControl('controlRoom/Win_Kit').setReadonly(!enabled)
        log.info('All rules {}'.format(enabled ? 'disabled' : 'enabled'))
    }
})
