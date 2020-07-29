const config = require('..');

console.log(config({
        envvardict: {
            "ENVCONFIG_name" : "newnameval",
            "ENVCONFIG_complex.num" : "500",
            "ENVCONFIG_newvariable" : "new variable value",
            "ENVCONFIG_newcomplex.newnum" : "1000.5"
        }
    }, './test/config.json'))