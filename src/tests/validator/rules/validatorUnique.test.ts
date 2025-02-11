/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import { queryBuilder } from '@src/core/domains/eloquent/services/EloquentQueryBuilderService';
import EmailRule from '@src/core/domains/validator/rules/EmailRule';
import RequiredRule from '@src/core/domains/validator/rules/RequiredRule';
import UniqueRule from '@src/core/domains/validator/rules/UniqueRule';
import Validator from '@src/core/domains/validator/service/Validator';
import TestEmailModel, { resetEmailTable } from '@src/tests/eloquent/models/TestEmailModel';
import testHelper from '@src/tests/testHelper';


describe('test validation', () => {

    const email = 'test@test.com'

    beforeAll(async () => {
        await testHelper.testBootApp()
    })

    test('email does not exist, passes, uses model constructor', async () => {
        await resetEmailTable()

        const validator = Validator.make({
            email: [new RequiredRule(), new EmailRule(), new UniqueRule(TestEmailModel, 'email')]
        })
        const result = await validator.validate({
            email
        })

        expect(result.passes()).toBe(true)
    })

    test('email is not unique, fails', async () => {
        await resetEmailTable()

        await queryBuilder(TestEmailModel).insert({
            email
        })  

        const validator = Validator.make({
            email: [new RequiredRule(), new EmailRule(), new UniqueRule(TestEmailModel, 'email')]
        })
        const result = await validator.validate({
            email
        })

        expect(result.fails()).toBe(true)
        expect(result.errors()).toEqual({
            email: ['The email field must be unique.']
        })
    })

    test('email is not unique, with custom message', async () => {
        await resetEmailTable()

        await queryBuilder(TestEmailModel).insert({
            email
        })  

        const validator = Validator.make({
            email: [new RequiredRule(), new EmailRule(), new UniqueRule(TestEmailModel, 'email')]
        }, {
            'email.unique': 'The email has already been taken.'
        })
        const result = await validator.validate({
            email
        })

        expect(result.fails()).toBe(true)
        expect(result.errors()).toEqual({
            email: ['The email has already been taken.']
        })
    })
});