// Правила для перевода системы на ручное/автоматическое управление

var permissions = require('rulesPermissions')

var manualControlOn = defineRule('manualControlOn', {
    when: function() {
        return dev['controlRoom/Manual_control']
    },

    then: function() {
        try {
            permissions.setAllPermissions(false)
            log.warning('System switched to manual control')
        } catch (e) {
            log.error(e)
        }

        getControl('controlRoom/Heater').setReadonly(false)
        getControl('controlRoom/FAN').setReadonly(false)
        getControl('controlRoom/Conditioner').setReadonly(false)
        getControl('controlRoom/Win_Kit').setReadonly(false)
    }
})

var manualControlOff = defineRule('manualControlOff', {
    when: function() {
        return !dev['controlRoom/Manual_control']
    },

    then: function() {
        try {
            permissions.setAllPermissions(true)
            log.warning('System switched to automatic control')
        } catch (e) {
            log.error(e)
        }

        getControl('controlRoom/Heater').setReadonly(true)
        getControl('controlRoom/FAN').setReadonly(true)
        getControl('controlRoom/Conditioner').setReadonly(true)
        getControl('controlRoom/Win_Kit').setReadonly(true)
    }
})
