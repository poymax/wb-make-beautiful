// Virtual controller

var PATH_TO_CONFIG = '/etc/wb-rules/virtualController/config.conf'

var config = readConfig(PATH_TO_CONFIG)

defineVirtualDevice('virtualController', {
    title: 'Virtual controller',
    cells: {
        Manual_control: {
            type: 'switch',
            value: false,
            readonly: false,
            order: 1,
        },

      	tIN: {
            type: 'temperature',
            value: dev[config["tIN"]],
            readonly: true,
            order: 2,
        },

        tOUT: {
            type: 'temperature',
            value: dev[config["tOUT"]],
            readonly: true,
            order: 3,
        },

        Humidity: {
            type: 'rel_humidity',
            value: dev[config["Humidity"]],
            readonly: true,
            order: 4,
        },

        FAN_present: {
            type: 'switch',
            value: false,
            readonly: false,
            order: 5,
        },
    },
})
