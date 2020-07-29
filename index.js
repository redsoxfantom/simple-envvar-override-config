function extract_override_vars(config) {
    let override_vars = {}
    for (override_var in config.envvardict) {
        if(!override_var.startsWith(config.prefix)) {
            continue;
        }
        let override_val = config.envvardict[override_var]
        let override_var_split = override_var.split(config.prefix_delimiter,2)[1]
        override_var_split = override_var_split.split(config.property_delimiter)
        if(override_var_split.length == 1) {
            override_vars[override_var_split[0]] = override_val
        } else {
            if(!override_vars.hasOwnProperty(override_var_split[0])) {
                override_vars[override_var_split[0]] = {}
            }
            let curr_override_var = override_vars[override_var_split[0]]
            for(i = 1; i < override_var_split.length - 2; i++) {
                if(!curr_override_var.hasOwnProperty(override_var_split[i])) {
                    curr_override_var[override_var_split[i]] = {}
                }
                curr_override_var = curr_override_var[override_var_split[i]]
            }
            curr_override_var[override_var_split[override_var_split.length - 1]] = override_val
        }
    }
    return override_vars
}

function merge_dicts(source, override) {
    for(override_var in override) {
        let override_val = override[override_var]
        if(!(override_val instanceof Object) || !source.hasOwnProperty(override_var)) {
            source[override_var] = override_val
        } else {
            source[override_var] = merge_dicts(source[override_var], override_val);
        }
    }
    return source
}

module.exports = (config = {}, file) => {
    if(!config.hasOwnProperty("prefix_delimiter")) {
        config.prefix_delimiter = "_"
    }
    if(!config.hasOwnProperty("prefix")) {
        config.prefix = "ENVCONFIG"
    }
    if(!config.prefix.endsWith(config.prefix_delimiter)) {
        config.prefix = config.prefix.concat(config.prefix_delimiter)
    }
    if(!config.hasOwnProperty("property_delimiter")) {
        config.property_delimiter = "."
    }
    if(!config.hasOwnProperty("envvardict")) {
        config.envvardict = process.env
    }

    const overridevars = extract_override_vars(config)
    const configfile = require(file)

    return merge_dicts(configfile, overridevars)
}