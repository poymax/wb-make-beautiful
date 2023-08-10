var PATH_TO_CONFIG = '/etc/wb-rules/virtualACdetector/config.conf'

var config = readConfig(PATH_TO_CONFIG)

var type = config['type']
var invertBoolean = config['invertBoolean']
var valueThreshold = config['valueThreshold']
var realTopic = config['realTopic']

var virtualACDetectorTopic = 'virtualACdetector/AC'

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
    dev[virtualACDetectorTopic] = status
}

function checkACalarm(value) {
    switch(type) {
        case 'value':
            setACalarm(value <= valueThreshold)
            break
        case 'boolean':
            setACalarm(invertBoolean ? !value : value)
            break
        case 'error':
            setACalarm(value !== undefined)
            break
        default:
            log.error('Wrong type "{}" in {}. Type must be "value", "boolean" or "error"', type, PATH_TO_CONFIG);
            break
    }
}

if (realTopic) {
    if (type === 'error') {
        checkACalarm(dev[realTopic + '#error'])
    } else {
        checkACalarm(dev[realTopic])
    }

    defineRule('virtualACalarm', {
        whenChanged: [
            realTopic + '#error',
            realTopic
        ],
        then: function(newValue) {
            checkACalarm(newValue)
        }
    })
} else {
    setACalarm(false)
}
