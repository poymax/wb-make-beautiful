var PATH_TO_CONFIG = '/etc/wb-rules/virtualACdetector/config.conf'

var config = readConfig(PATH_TO_CONFIG)

defineVirtualDevice('virtualACdetector', {
    title: 'Virtual AC detector',
    cells: {
        AC: {
            type: 'alarm',
            value: false,
            readonly: false,
            order: 1,
        },
    }
})

function setACalarm(status) {
    dev['virtualACdetector/AC'] = status
}

if (config['topic']) {
    setACalarm(dev[config['topic']] && !config['needToFlipBoolean'])

    defineRule('virtualACalarm', {
        whenChanged: [
            config['topic'] + '#error',
            config['topic']
        ],
        then: function(newValue) {
            switch(config['type']) {
                case 'value':
                    if (newValue <= 0) {
                        setACalarm(true)
                    } else {
                        setACalarm(false)
                    }
                    break
                case 'boolean':
                    if (config['needToFlipBoolean']) {
                        setACalarm(!newValue)
                    } else {
                        setACalarm(newValue)
                    }
                    break
                case 'error':
                    if (newValue !== '') {
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
    })
} else {
    setACalarm(false)
}
