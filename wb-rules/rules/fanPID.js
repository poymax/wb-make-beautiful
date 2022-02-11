var fanPID = require('pid').create({
    target: dev['controlRoom/tREQ_COOLER'], // уставка
    kp: dev['fanSettingsPID/kp'], // пропорциональный коэффициент
    ki: dev['fanSettingsPID/ki'], // интегральный коэффициент
    kd: dev['fanSettingsPID/kd'], // дифференциальный коэффициент
    direction: dev['fanSettingsPID/reverseDirection'], // направление (0 - прямое, 1 - обратное)
    outputMin: dev['fanSettingsPID/outputMin'], // минимальная величина выходного воздействия
    outputMax: dev['fanSettingsPID/outputMax'] // максимальная величина выходного воздействия
})

defineRule('pidOnOff', { // Регулятор работает, если запущен вентилятор
    whenChanged: 'controlRoom/FAN',
    then: function(enabled) {
        if (enabled) {
            fanPID.run(function() { // Запуск регулятора
                input = dev['{}'.format(dev['fanSettingsPID/input'])]
                output = fanPID.update(input)
                dev['{}'.format(dev['fanSettingsPID/output'])] = output
            }, dev['fanSettingsPID/period_sec'])
        } else {
            fanPID.stop()
            dev['controlRoom/Virtual_AnalogOUT'] = 0
        }
    }
})
