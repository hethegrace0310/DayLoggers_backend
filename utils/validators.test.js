const validator = require('./validators')

describe("validateEmail", function(){
    it("should return false without an @ symbol", function(){
        expect(validator.validateEmail("test.com")).toBeFalsy();
    })

    it("should return false without a .", function(){
        expect(validator.validateEmail("test@testcom")).toBeFalsy();
    })

    it("should return true on a valid email", function(){
        expect(validator.validateEmail("test@test.com")).toBeTruthy();
    })
})

