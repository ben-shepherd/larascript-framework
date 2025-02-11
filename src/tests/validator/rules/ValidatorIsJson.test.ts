/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import IsJson from '@src/core/domains/validator/rules/IsJson';
import Validator from '@src/core/domains/validator/service/Validator';

describe('test json validation rule', () => {
    it('passes for valid JSON object string', async () => {
        const validator = new Validator({
            data: [new IsJson()]
        });
        const result = await validator.validate({
            data: '{"name": "John", "age": 30}'
        });

        expect(result.passes()).toBe(true);
    });

    it('passes for valid JSON array string', async () => {
        const validator = new Validator({
            data: [new IsJson()]
        });
        const result = await validator.validate({
            data: '[1, 2, 3]'
        });

        expect(result.passes()).toBe(true);
    });

    it('passes for valid JSON primitive values', async () => {
        const validator = new Validator({
            data: [new IsJson()]
        });
        
        const primitives = [
            '"string"',
            '123',
            'true',
            'false',
            'null'
        ];

        for (const value of primitives) {
            const result = await validator.validate({ data: value });
            expect(result.passes()).toBe(true);
        }
    });

    it('fails for invalid JSON string', async () => {
        const validator = new Validator({
            data: [new IsJson()]
        });
        const result = await validator.validate({
            data: '{"name": "John", age: 30}'  // Missing quotes around age
        });

        expect(result.passes()).toBe(false);
        expect(result.errors()).toEqual({
            data: ['The data must be a valid JSON string.']
        });
    });

    it('fails when value is not a string', async () => {
        const validator = new Validator({
            data: [new IsJson()]
        });
        const result = await validator.validate({
            data: { name: "John" }  // Object instead of string
        });

        expect(result.passes()).toBe(false);
        expect(result.errors()).toEqual({
            data: ['The data must be a valid JSON string.']
        });
    });

    it('fails when value is null', async () => {
        const validator = new Validator({
            data: [new IsJson()]
        });
        const result = await validator.validate({
            data: null
        });

        expect(result.passes()).toBe(false);
    });

    it('fails when value is undefined', async () => {
        const validator = new Validator({
            data: [new IsJson()]
        });
        const result = await validator.validate({
            data: undefined
        });

        expect(result.passes()).toBe(false);
    });

    it('returns custom error message when validation fails', async () => {
        const validator = new Validator({
            data: [new IsJson()]
        }, {
            'data.json': 'Please provide a valid JSON string'
        });
        const result = await validator.validate({
            data: 'invalid json'
        });

        expect(result.passes()).toBe(false);
        expect(result.errors()).toEqual({
            data: ['Please provide a valid JSON string']
        });
    });
}); 