/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import IsObject from '@src/core/domains/validator/rules/IsObject';
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

});