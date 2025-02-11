/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import ArrayRule from '@src/core/domains/validator/rules/ArrayRule';
import IsObject from '@src/core/domains/validator/rules/ObjectRule';
import RequiredRule from '@src/core/domains/validator/rules/RequiredRule';
import StringRule from '@src/core/domains/validator/rules/StringRule';
import Validator from '@src/core/domains/validator/service/Validator';

describe('test validation', () => {
    test('validator returns validated data for simple validation', async () => {
        const validator = new Validator({
            name: [new RequiredRule(), new StringRule()]
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
            user: [new RequiredRule(), new IsObject()],
            'user.name': [new RequiredRule(), new StringRule()],
            'user.hobbies': [new RequiredRule(), new ArrayRule()]
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
            name: [new RequiredRule(), new StringRule()],
            age: [new RequiredRule(), new StringRule()],
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
            data: [new RequiredRule(), new ArrayRule()]
        });

        const result = await validator.validate({
            data: 'not an array'
        });

        expect(result.passes()).toBe(false);
        expect(result.validated()).toEqual({});
    });

    test('validator returns validated data with optional fields', async () => {
        const validator = new Validator({
            name: [new StringRule()],
            age: [new StringRule()]
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