/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import ValidatorService from '@src/core/domains/validator-legacy/services/ValidatorService';
import { App } from '@src/core/services/App';
import testHelper from '@src/tests/testHelper';
import testValidatorHelper from '@src/tests/validator-legacy/testValidatorHelper';

describe('test validation', () => {

    beforeAll(async () => {
        await testHelper.testBootApp()
    })

    const userValidator = new testValidatorHelper.UserValidator();
    const { UserObjectGood, UserObjectBad } = testValidatorHelper

    test('test provider', async () => {
        expect(App.container('validate')).toBeInstanceOf(ValidatorService);
    })

    test('test validator service', async () => {
        const result = await App.container('validate').validator().setRules(userValidator.rules()).validate(UserObjectGood);
        expect(result.success).toBeTruthy();

        const result2 = await App.container('validate').validator().setRules(userValidator.rules()).validate(UserObjectBad);
        expect(result2.success).toBeFalsy();
    })

    test('test successful validation', async () => {
        const result = await userValidator.validate(UserObjectGood)

        expect(result.success).toBeTruthy();
        expect(result.joi.error).toBeFalsy();
    })

    test('test failed validation', async () => {
        const result = await userValidator.validate(UserObjectBad)

        expect(result.success).toBeFalsy();
        expect(result.joi.error).toBeTruthy();

        App.container('logger').warn('failed validation', result.joi.error)
    })
});