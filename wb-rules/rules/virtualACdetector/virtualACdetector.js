var PATH_TO_CONFIG = '/etc/wb-rules/virtualACdetector/config.conf'

var config = readConfig(PATH_TO_CONFIG)

defineVirtualDevice('virtualACdetector', {
    title: 'Virtual AC detector',
    cells: {
        AC: {
            type: 'alarm',
            value: false,
            readonly: false,
            forceDefault: true,
            order: 1,
        },
    }
})

function setACalarm(status) {
    dev['virtualACdetector/AC'] = status
}

function checkACalarm(value) {
    switch(config['type']) {
        case 'value':
            if (value <= 0) {
                setACalarm(true)
            } else {
                setACalarm(false)
            }
            break
        case 'boolean':
            if (config['needToFlipBoolean']) {
                setACalarm(!value)
            } else {
                setACalarm(value)
            }
            break
        case 'error':
            if (value !== undefined) {
                setACalarm(true)
            } else {
                setACalarm(false)
            }
            break
        default:
            log.error('Wrong type "{}" in {}. Type must be "value", "boolean" or "error"', config['type'], PATH_TO_CONFIG);
            break
    }
}

if (config['topic']) {
    if (config['type'] == 'error') {
        checkACalarm(dev[config['topic'] + '#error'])
    } else {
        checkACalarm(dev[config['topic']])
    }

    defineRule('virtualACalarm', {
        whenChanged: [
            config['topic'] + '#error',
            config['topic']
        ],
        then: function(newValue) {
            checkACalarm(newValue)
        }
    })
} else {
    setACalarm(false)
}
