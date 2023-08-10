defineVirtualDevice('simulator', {
    title: 'Simulator',
    cells: {
        tIN: {
            type: 'temperature',
            value: 0,
            readonly: false,
            order: 1,
        },

        tOUT: {
            type: 'temperature',
            value: 0,
            readonly: false,
            order: 2,
        },

        Humidity: {
            type: 'rel_humidity',
            value: 0,
            readonly: false,
            order: 3,
        },

        AC_alarm: {
            type: 'switch',
            value: false,
            readonly: false,
            order: 4,
        },

        Fire_detector_1: {
            type: 'switch',
            value: false,
            readonly: false,
            order: 5,
        },

        Fire_detector_2: {
            type: 'switch',
            value: false,
            readonly: false,
            order: 6,
        },

        Door_1: {
            type: 'switch',
            value: false,
            readonly: false,
            order: 7,
        },

        Door_2: {
            type: 'switch',
            value: false,
            readonly: false,
            order: 8,
        },
    }
})
