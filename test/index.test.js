const override_config = require('..');
const { expect } = require('chai');

describe("Config updater tests", ()=>{
    it('should override simple variables', () =>{
        let actual = override_config({envvardict : {"ENVCONFIG_name" : "newnameval"}}, './test/config.json')
        expect(actual.name).to.equal("newnameval")
    })
    it('should override single variables in objects', () => {
        let actual = override_config({envvardict : {"ENVCONFIG_complex.name" : "newnameval"}}, './test/config.json')
        expect(actual.complex.name).to.equal("newnameval")
        expect(actual.complex.num).to.equal(100)
    })
    it('should overwrite objects with single vals', () => {
        let actual = override_config({envvardict : {"ENVCONFIG_complex" : "newcomplexobject"}}, './test/config.json')
        expect(actual.complex).to.equal("newcomplexobject")
        expect(actual.complex).to.not.have.property("name")
    })
    it('should allow redefinition of envvar prefix', () => {
        let actual = override_config({prefix: "DUMMY", envvardict : {"DUMMY_name" : "newnameval"}}, './test/config.json')
        expect(actual.name).to.equal("newnameval")
    })
    it('should handle new envvar prefix with _', () => {
        let actual = override_config({prefix: "DUMMY_", envvardict : {"DUMMY_name" : "newnameval"}}, './test/config.json')
        expect(actual.name).to.equal("newnameval")
    })
    it('should allow redefinition of var delimiter', () => {
        let actual = override_config({property_delimiter: ">",envvardict : {"ENVCONFIG_complex>name" : "newnameval"}}, {complex : {name : "oldname", num: 100}})
        expect(actual.complex.name).to.equal("newnameval")
        expect(actual.complex.num).to.equal(100) 
    })
})