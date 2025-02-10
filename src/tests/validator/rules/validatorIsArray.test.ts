/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import IsArray from '@src/core/domains/validator/rules/IsArray';
import Validator from '@src/core/domains/validator/service/Validator';


describe('test validation', () => {

    test('simple isArray, passes', async () => {

        const validator = Validator.make({
            numbers: [new IsArray()]
        })

        const result = await validator.validate({ numbers: [1, 2, 3] })
        expect(result.passes()).toBe(true)
    })

    test('simple isArray, fails', async () => {
        const validator = Validator.make({
            numbers: [new IsArray()]
        })

        const result = await validator.validate({ numbers: 'not an array' })
        expect(result.passes()).toBe(false)
        expect(result.errors()).toEqual({
            numbers: 'The numbers field must be an array.'
        })
    })  

    test('empty array should pass', async () => {
        const validator = Validator.make({
            numbers: [new IsArray()]
        })

        const result = await validator.validate({ numbers: [] })
        expect(result.passes()).toBe(true)
    })

    test('array with mixed types should pass', async () => {
        const validator = Validator.make({
            mixed: [new IsArray()]
        })

        const result = await validator.validate({ mixed: [1, "string", true, { key: "value" }] })
        expect(result.passes()).toBe(true)
    })

    test('object should fail', async () => {
        const validator = Validator.make({
            data: [new IsArray()]
        })

        const result = await validator.validate({ data: { key: "value" } })
        expect(result.passes()).toBe(false)
        expect(result.errors()).toEqual({
            data: 'The data field must be an array.'
        })
    })

    test('null should fail', async () => {
        const validator = Validator.make({
            data: [new IsArray()]
        })

        const result = await validator.validate({ data: null })
        expect(result.passes()).toBe(false)
        expect(result.errors()).toEqual({
            data: 'The data field must be an array.'
        })
    })

    test('undefined should fail', async () => {
        const validator = Validator.make({
            data: [new IsArray()]
        })

        const result = await validator.validate({ data: undefined })
        expect(result.passes()).toBe(false)
        expect(result.errors()).toEqual({
            data: 'The data field must be an array.'
        })
    })

})