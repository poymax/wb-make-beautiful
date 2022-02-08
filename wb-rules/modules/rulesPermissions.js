// Модуль для хранения, чтения и установки разрешений правил

module.static.rulesList = {
    'AC': true,
    'Fire': true,
    'Heater': true,
    'WinKit': true,
}

exports.getRulePermission = function(rule) {
    return module.static.rulesList[rule]
}

exports.setRulePermission = function(rule, value) {
    if (typeof value == 'boolean') {
        module.static.rulesList[rule] = value
    } else {
        throw new TypeError('Failed to set "{}" rule permission! \
                            "{}" is not a valid value'.format(rule, value))
    }
}

exports.setAllPermissions = function(value) {
    if (typeof value == 'boolean') {
        for (key in module.static.rulesList) {
            module.static.rulesList[key] = value
        }
    } else {
        throw new TypeError('Failed to set rules permissions! \
                            "{}" is not a valid value'.format(rule, value))
    }
}
