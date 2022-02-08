// Виртуальный пункт управления

defineVirtualDevice('controlRoom', {
    title: 'Control Room',
    cells: {
        tIN: {
            type: 'temperature',
            value: 20,
            readonly: false,
            // lazyInit: true,
            order: 1,
        },
        
        tOUT: {
            type: 'temperature',
            value: 20,
            readonly: false,
            // lazyInit: true,
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

        Fire: {
            type: 'switch',
            value: false,
            order: 8,
        },

        AC_Power: {
            type: 'switch',
            value: true,
            order: 9,
        },

        tON: {
            type: 'value',
            value: 20,
            readonly: false,
            order: 10,
        },
        
        tREQ: {
            type: 'value',
            value: 23,
            readonly: false,
            order: 11,
        },

        Master_cooler: {
            type: 'text',
            value: 'none',
            order: 12,
        },

        Manual_control: {
            type: 'switch',
            value: false,
            order: 13,
        },
    },
})
