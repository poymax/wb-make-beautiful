defineVirtualDevice('Out_temp_calc', {
    title: 'Out_temp_calc',
    cells: {
        Fix_power_fan: {
            type: 'switch',
            value: false,
            readonly: false,
            order: 1,
        },
        V_fan: {
            type: 'value',
            readonly: false,
            value: 0,
            order: 3,
        },
        S_fan: {
            type: 'value',
            readonly: false,
            value: 0,
            order: 4,
        },
        Efficiency: {
            type: 'value',
            readonly: false,
            value: 0.5,
            order: 5,
        },
        t_out: {
            type: 'value',
            value: 0,
            order: 6,
        },
    },
})
