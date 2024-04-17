defineVirtualDevice('virtualACdetectorV2', {
    title: 'Virtual AC detector V2',
    cells: {
        AC_alarm: {
            type: 'alarm',
            value: false,
            readonly: false,
            order: 1,
        },
        Generator: {
            type: 'switch',
            value: false,
            readonly: true,
            order: 2,
        },
        Voltage: {
            type: 'voltage',
            value: 0,
            readonly: true,
            order: 3,
        },
        Input_1: {
            type: 'switch',
            value: false,
            readonly: true,
            order: 4,
        },
        ATS_1: {
            type: 'switch',
            value: false,
            readonly: true,
            order: 5,
        },
        Input_2: {
            type: 'switch',
            value: false,
            readonly: true,
            order: 6,
        },
        ATS_2: {
            type: 'switch',
            value: false,
            readonly: true,
            order: 7,
        },
        Input_3: {
            type: 'switch',
            value: false,
            readonly: true,
            order: 8,
        },
        ATS_3: {
            type: 'switch',
            value: false,
            readonly: true,
            order: 9,
        },
    },
})
