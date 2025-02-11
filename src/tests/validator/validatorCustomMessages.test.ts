/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import IsNumber from '@src/core/domains/validator/rules/isNumber';
import IsString from '@src/core/domains/validator/rules/IsString';
import Required from '@src/core/domains/validator/rules/Required';
import Validator from '@src/core/domains/validator/service/Validator';

describe('test validation', () => {

    test('validation fails with custom messages', async () => {

        const result = await Validator.make({
            name: [new Required(), new IsString()]
        }, {
            'name.required': 'This is a custom validation message (required)',
            'name.is_string': 'This is a custom validation message (is_string)'
        }).validate({
            name: null
        });

        expect(result.passes()).toBe(false);
        expect(result.errors()).toEqual({
            name: ['This is a custom validation message (required)', 'This is a custom validation message (is_string)']
        });

    });

    test('validation passes with valid data', async () => {
        const result = await Validator.make({
            name: [new Required(), new IsString()]
        }, {
            'name.required': 'Name field is required',
            'name.is_string': 'Name must be a string'
        }).validate({
            name: 'John Doe'
        });

        expect(result.passes()).toBe(true);
        expect(result.errors()).toEqual({});
    });

    test('validation with multiple fields and custom messages', async () => {
        const result = await Validator.make({
            name: [new Required(), new IsString()],
            age: [new Required(), new IsNumber()]
        }, {
            'name.required': 'Name is required',
            'name.is_string': 'Name must be a string',
            'age.required': 'Age is required',
            'age.is_number': 'Age must be a number'
        }).validate({
            name: null,
            age: 'not a number'
        });

        expect(result.passes()).toBe(false);
        expect(result.errors()).toEqual({
            name: ['Name is required', 'Name must be a string'],
            age: ['Age must be a number']
        });
    });

    test('validation with missing custom message falls back to default', async () => {
        const result = await Validator.make({
            name: [new Required(), new IsString()]
        }, {
            'name.required': 'Name is required'
            // No custom message for is_string
        }).validate({
            name: null
        });

        expect(result.passes()).toBe(false);
        expect(result.errors()).toEqual({
            name: ['Name is required', 'The name field must be a string.']
        });
    });

    test('validation with partial data and custom messages', async () => {
        const result = await Validator.make({
            name: [new Required(), new IsString()],
            email: [new Required(), new IsString()]
        }, {
            'name.required': 'Name field is mandatory',
            'email.required': 'Email field is mandatory'
        }).validate({
            name: 'John Doe'
            // email missing
        });

        expect(result.passes()).toBe(false);
        expect(result.errors()).toEqual({
            email: ['Email field is mandatory', 'The email field must be a string.']
        });
    });

});