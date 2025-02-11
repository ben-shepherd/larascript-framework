/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import RegexRule from '@src/core/domains/validator/rules/RegexRule';
import Validator from '@src/core/domains/validator/service/Validator';

describe('test regex validation rule', () => {
    it('passes when value matches regex pattern', async () => {
        const validator = new Validator({
            username: [new RegexRule('^[a-zA-Z0-9]+$')]
        });
        const result = await validator.validate({
            username: 'john123'
        });

        expect(result.passes()).toBe(true);
    });

    it('fails when value does not match regex pattern', async () => {
        const validator = new Validator({
            username: [new RegexRule('^[a-zA-Z0-9]+$')]
        });
        const result = await validator.validate({
            username: 'john@123'
        });

        expect(result.passes()).toBe(false);
        expect(result.errors()).toEqual({
            username: ['The username field format is invalid.']
        });
    });

    it('accepts RegExp object as pattern', async () => {
        const validator = new Validator({
            username: [new RegexRule(/^[a-zA-Z0-9]+$/)]
        });
        const result = await validator.validate({
            username: 'john123'
        });

        expect(result.passes()).toBe(true);
    });

    it('fails when value is null', async () => {
        const validator = new Validator({
            username: [new RegexRule('^[a-zA-Z0-9]+$')]
        });
        const result = await validator.validate({
            username: null
        });

        expect(result.passes()).toBe(false);
    });

    it('fails when value is undefined', async () => {
        const validator = new Validator({
            username: [new RegexRule('^[a-zA-Z0-9]+$')]
        });
        const result = await validator.validate({
            username: undefined
        });

        expect(result.passes()).toBe(false);
    });

    it('returns custom error message when validation fails', async () => {
        const validator = new Validator({
            username: [new RegexRule('^[a-zA-Z0-9]+$')]
        }, {
            'username.regex': 'Username can only contain letters and numbers'
        });
        const result = await validator.validate({
            username: 'john@123'
        });

        expect(result.passes()).toBe(false);
        expect(result.errors()).toEqual({
            username: ['Username can only contain letters and numbers']
        });
    });

    it('converts non-string values to string before testing', async () => {
        const validator = new Validator({
            code: [new RegexRule('^[0-9]+$')]
        });
        const result = await validator.validate({
            code: 12345
        });

        expect(result.passes()).toBe(true);
    });

    it('handles toString throwing an error during string conversion', async () => {
        const rule = new RegexRule(/test/);
        
        // Create object that throws when converted to string
        const throwingObject = {
            toString: () => {
                throw new Error('Cannot convert to string');
            }
        };

        rule.setData(throwingObject);
        const result = await rule.validate();
        
        expect(result).toBe(false);
        
        const error = rule.getError();
        expect(error[rule.getDotNotationPath()][0]).toBe('Cannot convert to string');
    });
}); 