defineRule('restartRules', {
    whenChanged: 'virtualController/Restart_rules',
    then: function() {
        runShellCommand('service wb-rules restart')
    }
})
