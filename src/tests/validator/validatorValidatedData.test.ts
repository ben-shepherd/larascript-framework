/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import IsArray from '@src/core/domains/validator/rules/IsArray';
import IsObject from '@src/core/domains/validator/rules/IsObject';
import IsString from '@src/core/domains/validator/rules/IsString';
import Required from '@src/core/domains/validator/rules/Required';
import Validator from '@src/core/domains/validator/service/Validator';

describe('test validation', () => {
    test('validator returns validated data for simple validation', async () => {
        const validator = new Validator({
            name: [new Required(), new IsString()]
        });

        const result = await validator.validate({
            name: 'John Doe'
        });

        expect(result.passes()).toBe(true);
        expect(result.validated()).toEqual({
            name: 'John Doe'
        });
    });

    test('validator returns validated data for nested objects', async () => {
        const validator = new Validator({
            user: [new Required(), new IsObject()],
            'user.name': [new Required(), new IsString()],
            'user.hobbies': [new Required(), new IsArray()]
        });

        const data = {
            user: {
                name: 'John Doe',
                hobbies: ['reading', 'coding']
            }
        };

        const result = await validator.validate(data);

        expect(result.passes()).toBe(true);
        expect(result.validated()).toEqual(data);
    });

    test('validator returns partial validated data when some fields fail', async () => {
        const validator = new Validator({
            name: [new Required(), new IsString()],
            age: [new Required(), new IsString()],
        });

        const result = await validator.validate({
            name: 'John Doe',
            age: 25  // This should fail IsString validation
        });

        expect(result.passes()).toBe(false);
        expect(result.validated()).toEqual({
            name: 'John Doe'
        });
    });

    test('validator returns empty object when all validations fail', async () => {
        const validator = new Validator({
            data: [new Required(), new IsArray()]
        });

        const result = await validator.validate({
            data: 'not an array'
        });

        expect(result.passes()).toBe(false);
        expect(result.validated()).toEqual({});
    });

    test('validator returns validated data with optional fields', async () => {
        const validator = new Validator({
            name: [new IsString()],
            age: [new IsString()]
        });

        const result = await validator.validate({
            name: 'John Doe'
            // age is optional
        });

        expect(result.passes()).toBe(false);
        expect(result.validated()).toEqual({
            name: 'John Doe'
        });
    });
});