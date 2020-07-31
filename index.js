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

module.exports = (overrideconfig = {}, config) => {
    if(!overrideconfig.hasOwnProperty("prefix_delimiter")) {
        overrideconfig.prefix_delimiter = "_"
    }
    if(!overrideconfig.hasOwnProperty("prefix")) {
        overrideconfig.prefix = "ENVCONFIG"
    }
    if(!overrideconfig.prefix.endsWith(overrideconfig.prefix_delimiter)) {
        overrideconfig.prefix = overrideconfig.prefix.concat(overrideconfig.prefix_delimiter)
    }
    if(!overrideconfig.hasOwnProperty("property_delimiter")) {
        overrideconfig.property_delimiter = "."
    }
    if(!overrideconfig.hasOwnProperty("envvardict")) {
        overrideconfig.envvardict = process.env
    }

    let overridevars = extract_override_vars(overrideconfig)
    
    if(typeof config === "string") {
        return merge_dicts(require(config), overridevars)
    }
    return merge_dicts(config, overridevars)
}