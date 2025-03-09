/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import IsNumber from '@src/core/domains/validator/rules/NumberRule';
import Validator from '@src/core/domains/validator/service/Validator';

describe('test validation', () => {

    test('isNumber, passes', async () => {
        const validator = Validator.make({
            numberField: [new IsNumber()]
        })

        const result = await validator.validate({
            numberField: 123
        })


        expect(result.passes()).toBe(true)
    })

    test('isNumber, fails with non-number value', async () => {
        const validator = Validator.make({
            numberField: [new IsNumber()]
        })

        const result = await validator.validate({
            objectField: 'non-number'
        })

        expect(result.passes()).toBe(false)
    })

});