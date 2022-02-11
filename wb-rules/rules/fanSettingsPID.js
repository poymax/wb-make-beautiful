// Настройка ПИД-регулятора

defineVirtualDevice('fanSettingsPID', {
    title: 'FAN PID',
    cells: {
        kp: {
            type: 'value',
            value: 0,
            readonly: false,
            order: 1,
        },
        
        ki: {
            type: 'value',
            value: 0,
            readonly: false,
            order: 2,
        },

        kd: {
            type: 'value',
            value: 0,
            readonly: false,
            order: 3,
        },

        reverseDirection: {
            type: 'switch',
            value: false,
            order: 4,
        },

        outputMin: {
            type: 'value',
            value: 0,
            readonly: false,
            order: 5,
        },

        outputMax: {
            type: 'value',
            value: 1,
            readonly: false,
            order: 6,
        },

        input: {
            type: 'text',
            value: null,
            readonly: false,
            order: 7,
        }, 

        output: {
            type: 'text',
            value: null,
            readonly: false,
            order: 8,
        },

        period_sec: {
            type: 'value',
            value: 1,
            readonly: false,
            order: 9,
        },
    },
})
