// Виртуальный пункт управления

defineVirtualDevice('controlRoom', {
    title: 'Control Room',
    cells: {
        tIN: {
            type: 'temperature',
            value: 20,
            readonly: false,
            order: 1,
        },
        
        tOUT: {
            type: 'temperature',
            value: 20,
            readonly: false,
            order: 2,
        },

        Humidity: {
            type: 'range',
            value: 50,
            min: 0,
            max: 100,
            readonly: false,
            order: 3,
        },

        Heater: {
            type: 'switch',
            value: false,
            readonly: true,
            order: 4,
        },

        FAN: {
            type: 'switch',
            value: false,
            readonly: true,
            order: 5,
        },

        Conditioner: {
            type: 'switch',
            value: false,
            readonly: true,
            order: 6,
        },

        Win_Kit: {
            type: 'switch',
            value: false,
            readonly: true,
            order: 7,
        },

        Fire_alarm: {
            type: 'switch',
            value: false,
            order: 8,
        },

        AC_alarm: {
            type: 'switch',
            value: false,
            order: 9,
        },

        Overheat_alarm: {
            type: 'alarm',
            value: false,
            order: 10,
        },

        tON_COOLER: {
            type: 'temperature',
            value: 20,
            readonly: false,
            order: 11,
        },
        
        tREQ_COOLER: {
            type: 'temperature',
            value: 23,
            readonly: false,
            order: 12,
        },

        tOUT_FLIP: {
            type: 'temperature',
            value: 20,
            readonly: false,
            order: 13,
        },

        tIN_MAX: {
            type: 'temperature',
            value: 30,
            readonly: false,
            order: 14,
        },

        Humidity_MAX: {
            type: 'rel_humidity',
            value: 80,
            readonly: false,
            order: 15,
        },

        Master_cooler: {
            type: 'text',
            value: 'none',
            order: 16,
        },

        Manual_control: {
            type: 'switch',
            value: false,
            order: 17,
        },

        Virtual_AnalogOUT: {
            type: 'voltage',
            value: 0,
            order: 18,
        }
    },
})
