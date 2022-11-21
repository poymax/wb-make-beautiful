defineVirtualDevice('virtualController', {
    title: 'Virtual controller',
    cells: {
        Manual_control: {
            type: 'switch',
            value: true,
            readonly: false,
            order: 1,
        },

      	tIN: {
            type: 'temperature',
            value: 0,
            readonly: true,
            order: 2,
        },

        tOUT: {
            type: 'temperature',
            value: 0,
            readonly: true,
            order: 3,
        },

        Humidity: {
            type: 'rel_humidity',
            value: 0,
            readonly: true,
            order: 4,
        },

        FAN_present: {
            type: 'switch',
            value: false,
            readonly: false,
            order: 5,
        },

        FAN: {
            type: 'switch',
            value: false,
            readonly: false,
            order: 6,
        },

        Heater_present: {
            type: 'switch',
            value: false,
            readonly: false,
            order: 7,
        },

        Heater: {
            type: 'switch',
            value: false,
            readonly: false,
            order: 8,
        },

        WinKit_present: {
            type: 'switch',
            value: false,
            readonly: false,
            order: 9,
        },

        WinKit: {
            type: 'switch',
            value: false,
            readonly: false,
            order: 10,
        },

        tIN_cooling: {
            type: 'temperature',
            value: 25,
            readonly: false,
            order: 11,
        },

        tIN_cooling_delta: {
            type: 'temperature',
            value: 3,
            readonly: false,
            order: 12,
        },

        tIN_overheat: {
            type: 'temperature',
            value: 30,
            readonly: false,
            order: 13,
        },

        tIN_overheat_delta: {
            type: 'temperature',
            value: 3,
            readonly: false,
            order: 14,
        },

      	tIN_overheat_critical: {
            type: 'temperature',
            value: 35,
            readonly: false,
            order: 15,
        },

      	tIN_overheat_critical_delta: {
            type: 'temperature',
            value: 3,
            readonly: false,
            order: 16,
        },
        
        tIN_heating: {
            type: 'temperature',
            value: 13,
            readonly: false,
            order: 17,
        },

        tIN_heating_delta: {
            type: 'temperature',
            value: 3,
            readonly: false,
            order: 18,
        },

        tOUT_winKit: {
            type: 'temperature',
            value: 2,
            readonly: false,
            order: 19,
        },

        tOUT_winKit_delta: {
            type: 'temperature',
            value: 2,
            readonly: false,
            order: 20,
        },

        tOUT_switching: {
            type: 'temperature',
            value: 20,
            readonly: false,
            order: 21,
        },

        tOUT_switching_delta: {
            type: 'temperature',
            value: 2,
            readonly: false,
            order: 22,
        },

        Humidity_threshold: {
            type: 'rel_humidity',
            value: 80,
            readonly: false,
            order: 23,
        },

        Humidity_threshold_delta: {
            type: 'rel_humidity',
            value: 20,
            readonly: false,
            order: 24,
        },

        Restart_rules: {
            type: 'pushbutton',
            order: 25
        },
    },
})
