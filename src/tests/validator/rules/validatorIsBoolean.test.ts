/* eslint-disable no-undef */
import IsBoolean from "@src/core/domains/validator/rules/IsBoolean";
import Validator from "@src/core/domains/validator/service/Validator";

describe('Validator Boolean Rule Tests', () => {
    it('should pass validation when field is boolean true', async () => {
        const validator = new Validator({
            boolField: [new IsBoolean()]
        });

        const validation = await validator.validate({
            boolField: true
        });
        expect(validation.passes()).toBe(true);
    });

    it('should pass validation when field is boolean false', async () => {
        const validator = new Validator({
            boolField: [new IsBoolean()]
        });

        const validation = await validator.validate({
            boolField: false
        });
        expect(validation.passes()).toBe(true);
    });

    it('should fail validation when field is string "true"', async () => {
        const validator = new Validator({
            boolField: [new IsBoolean()]
        });

        const validation = await validator.validate({
            boolField: "true"
        });
        expect(validation.passes()).toBe(false);
        expect(validation.errors()?.boolField).toBeDefined();
    });

    it('should fail validation when field is number 1', async () => {
        const validator = new Validator({
            boolField: [new IsBoolean()]
        });

        const validation = await validator.validate({
            boolField: 1
        });
        expect(validation.passes()).toBe(false);
        expect(validation.errors()?.boolField).toBeDefined();
    });

    it('should fail validation when field is number 0', async () => {
        const validator = new Validator({
            boolField: [new IsBoolean()]
        });

        const validation = await validator.validate({
            boolField: 0
        });
        expect(validation.passes()).toBe(false);
        expect(validation.errors()?.boolField).toBeDefined();
    });

    it('should fail validation when field is null', async () => {
        const validator = new Validator({
            boolField: [new IsBoolean()]
        });

        const validation = await validator.validate({
            boolField: null
        });
        expect(validation.passes()).toBe(false);
        expect(validation.errors()?.boolField).toBeDefined();
    });

    it('should fail validation when field is undefined', async () => {
        const validator = new Validator({
            boolField: [new IsBoolean()]
        });

        const validation = await validator.validate({
            boolField: undefined
        });
        expect(validation.passes()).toBe(false);
        expect(validation.errors()?.boolField).toBeDefined();
    });
}); 