defineVirtualDevice('virtualCooler', {
    title: 'Virtual cooler',
    cells: {
        Mode: {
            type: 'text',
            value: 'OFF',
            readonly: false,
            order: 1,
        },
        Temperature: {
            type: 'temperature',
            value: 0,
            readonly: true,
            order: 2,
        },
        Cooler2_present: {
            type: 'switch',
            value: false,
            readonly: false,
            order: 3,
        },
    }
})
