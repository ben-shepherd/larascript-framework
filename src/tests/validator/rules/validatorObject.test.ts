/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import IsObject from '@src/core/domains/validator/rules/ObjectRule';
import Validator from '@src/core/domains/validator/service/Validator';

describe('test validation', () => {

    test('isObject, passes', async () => {
        const validator = Validator.make({
            objectField: [new IsObject()]
        })

        const result = await validator.validate({
            objectField: { key: 'value' }
        })

        expect(result.passes()).toBe(true)
    })

    test('isObject, fails with non-object value', async () => {
        const validator = Validator.make({
            objectField: [new IsObject()]
        })

        const result = await validator.validate({
            objectField: 123
        })

        expect(result.passes()).toBe(false)
    })

    test('required properties should pass', async () => {
        const validator = Validator.make({
            data: [new IsObject(['name', 'age'])]
        })


        const result = await validator.validate({ 
            data: { name: 'John', age: 30 }
        })
        expect(result.passes()).toBe(true)
    })
    
    test('required properties should fail', async () => {
        const validator = Validator.make({
            data: [new IsObject(['name', 'age', 'id'])]
        })

        const result = await validator.validate({ 
            data: { name: 'John', age: 30 }
        })
        expect(result.passes()).toBe(false)
        expect(result.errors()).toEqual({
            data: ['The data field must contain the following properties: name, age, id.']
        })

    })
});