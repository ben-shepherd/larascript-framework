/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import { IRule } from '@src/core/domains/validator/interfaces/IRule';
import { IValidatorMessages } from '@src/core/domains/validator/interfaces/IValidator';
import { IValidatorResult } from '@src/core/domains/validator/interfaces/IValidatorResult';
import Accepted from '@src/core/domains/validator/rules/Accepted';
import AcceptedIf from '@src/core/domains/validator/rules/AcceptedIf';
import Validator from '@src/core/domains/validator/service/Validator';

type FlowOptions = {
    good: {
        data: object,
        rules: IRule[],
        messages?: IValidatorMessages
    },
    bad: {
        data: object,
        rules: IRule[],
        messages?: IValidatorMessages
    }
}
type FlowResult<TGood extends object, TBad extends object> = {
    good: IValidatorResult<TGood>
    bad: IValidatorResult<TBad>
}

const testHappySadValidators = async ({good, bad}: FlowOptions): Promise<FlowResult<typeof good.data, typeof bad.data>> => {
    const goodValidator = Validator.make(good.rules, good.messages)
    const badValidator = Validator.make(bad.rules, bad.messages)

    const goodResult = await goodValidator.validate(good.data)
    const badResult = await badValidator.validate(bad.data)

    return {
        good: goodResult,
        bad: badResult
    }
}


describe('test validation', () => {

    test('accepted', async () => {

        const validAcceptedValues = [
            { accepted: 'yes', otherField: true },
            { accepted: 'on', otherField: true },
            { accepted: 1, otherField: true },
            { accepted: '1', otherField: true },
            { accepted: true, otherField: true },
            { accepted: 'true', otherField: true }
        ];

        for (const data of validAcceptedValues) {
            const {good, bad} = await testHappySadValidators({
                good: {
                    data,
                    rules: [
                        new Accepted()
                    ]

                },
                bad: {
                    data: {
                        accepted: false
                    },
                    rules: [
                        new Accepted()
                    ],
                    messages: {
                        'accepted': 'The :attribute must be accepted.'
                    }
                }
            })

            expect(good.passes()).toBe(true);
            expect(Object.keys(good.errors()).length).toBe(0);
    
    
            expect(bad.passes()).toBe(false);
            expect(Object.keys(bad.errors()).length).toBe(1);
            expect(bad.errors()).toEqual({
                'accepted': 'The :attribute must be accepted.'
            });
        }

    })


    test('accepted if', async () => {
        // Test cases where condition is met (otherField = true)
        const validAcceptedValues = [
            { accepted: 'yes', otherField: true },
            { accepted: 'on', otherField: true },
            { accepted: 1, otherField: true },
            { accepted: '1', otherField: true },
            { accepted: true, otherField: true },
            { accepted: 'true', otherField: true }
        ];

        for (const data of validAcceptedValues) {
            const result = await testHappySadValidators({
                good: {
                    data,
                    rules: [
                        new AcceptedIf('accepted', 'otherField', true)
                    ]
                },
                bad: {
                    data: {
                        accepted: 'no', // Invalid acceptance value
                        otherField: true
                    },
                    rules: [
                        new AcceptedIf('accepted', 'otherField', true)
                    ],
                    messages: {
                        'accepted_if': 'The :attribute must be accepted when :other is :value.'
                    }
                }
            });

            expect(result.good.passes()).toBe(true);
            expect(Object.keys(result.good.errors()).length).toBe(0);
        }

        // Test case where condition is not met (should pass regardless of accepted value)
        const conditionNotMetResult = await testHappySadValidators({
            good: {
                data: {
                    accepted: 'no', // Any value should pass when condition is not met
                    otherField: false
                },
                rules: [
                    new AcceptedIf('accepted', 'otherField', true)
                ]
            },
            bad: {
                data: {
                    accepted: 'no',
                    otherField: true // Condition is met but value is invalid
                },
                rules: [
                    new AcceptedIf('accepted', 'otherField', true)
                ],
                messages: {
                    'accepted_if': 'The :attribute must be accepted when :other is :value.'
                }
            }
        });

        expect(conditionNotMetResult.good.passes()).toBe(true);
        expect(conditionNotMetResult.bad.passes()).toBe(false);
        expect(conditionNotMetResult.bad.errors()).toEqual({
            'accepted_if': 'The :attribute must be accepted when :other is :value.'
        });
    })


});