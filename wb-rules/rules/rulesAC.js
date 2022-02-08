// Правила при отключении городской электросети

var permissions = require('rulesPermissions')

var acOffDetected = defineRule('acOffDetected', {
    when: function() {
        return !dev['controlRoom/AC_Power']
    },

    then: function() {
        log.warning('AC OFF detected')

        if (permissions.getRulePermission('AC')) {
            dev['controlRoom/Master_cooler'] = 'FAN'
            log.info('{} selected as master cooler'.format(dev['controlRoom/Master_cooler']))
        }
    }
})

var acOnDetected = defineRule('acOnDetected', {
    when: function() {
        return dev['controlRoom/AC_Power']
    },

    then: function() {
        log.warning('AC ON detected')
    }
})
