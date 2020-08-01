# simple-envvar-override-config

Allows you to read in a config file and selectively overwrite values based off of environment variables.

Config can be a file or just a dictionary

## Example
Given the following config file:
```json
{
    "name" : "nameval",
    "complex" : {
        "name" : "complexnameval",
        "num" : 100
    }
}
```
And the following environment variables:
```
ENVCONFIG_name = "newnameval"
ENVCONFIG_complex.num = "500"
ENVCONFIG_newvariable = "new variable value"
ENVCONFIG_newcomplex.newnum = "1000.5"
```
Then running the following code:
```javascript
const override_config = require('simple-envvar-override-config');
const new_config = override_config('/path/to/config.json');
console.log(new_config);
```
Will print the following:
```json
{
  "name": "newnameval",
  "complex": { 
      "name": "complexnameval", 
      "num": "500" 
  },
  "newvariable": "new variable value",
  "newcomplex": { 
      "newnum": "1000.5" 
  }
}
```

## TODOS
2) Handle arrays
3) Handle defining "type" of value in env var. Right now everything is a string