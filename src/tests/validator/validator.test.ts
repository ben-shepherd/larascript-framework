/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import { IRulesObject } from '@src/core/domains/validator/interfaces/IRule';
import { IValidatorAttributes, IValidatorMessages } from '@src/core/domains/validator/interfaces/IValidator';
import { IValidatorResult } from '@src/core/domains/validator/interfaces/IValidatorResult';
import Accepted from '@src/core/domains/validator/rules/Accepted';
import AcceptedIf from '@src/core/domains/validator/rules/AcceptedIf';
import Validator from '@src/core/domains/validator/service/Validator';

type FlowOptions = {
    data: IValidatorAttributes,
    rules: IRulesObject,
    messages?: IValidatorMessages
}
type FlowResult<TGood extends IValidatorAttributes, TBad extends IValidatorAttributes> = {
    good: IValidatorResult<TGood>
    bad: IValidatorResult<TBad>
}

const testHappySadValidators = async (good: FlowOptions, bad: FlowOptions): Promise<FlowResult<typeof good.data, typeof bad.data>> => {
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
            { accepted: 'yes' },
            { accepted: 'on' },
            { accepted: 1 },
            { accepted: '1' },
            { accepted: true },
            { accepted: 'true' }
        ];

        for (const data of validAcceptedValues) {

            const goodValidator = Validator.make({
                accepted: new Accepted()
            })
            const good = await goodValidator.validate(data)
            
            expect(good.passes()).toBe(true);
            expect(Object.keys(good.errors() || {}).length).toBe(0);
    
            const badValidator = Validator.make({
                accepted: new Accepted()
            })
            const bad = await badValidator.validate({
                accepted: false
            })
    
            expect(bad.passes()).toBe(false);
            expect(Object.keys(bad.errors() || {}).length).toBe(1);
            expect(bad.errors()).toEqual({
                'accepted': 'The accepted field must be accepted.'
            });
        }

    })


    test('accepted if', async () => {

        const validAcceptedValues = [
            { accepted_if: 'yes', otherField: true },
            { accepted_if: 'on', otherField: true },
            { accepted_if: 1, otherField: true },
            { accepted_if: '1', otherField: true },
            { accepted_if: true, otherField: true },
            { accepted_if: 'true', otherField: true }
        ];

        for (const data of validAcceptedValues) {
            const goodValidator = Validator.make({
                accepted_if: new AcceptedIf('otherField', true)
            })
            const good = await goodValidator.validate(data)

            console.log('[accepted if, good]', {
                data,
                passes: good.passes(),
                errors: good.errors()
            })
            expect(good.passes()).toBe(true);
            expect(Object.keys(good.errors() || {}).length).toBe(0);
        }

        const badValidator = Validator.make({
            accepted_if: new AcceptedIf('otherField', true)
        })
        const bad = await badValidator.validate({
            accepted_if: 'no',
            otherField: true
        })

        expect(bad.passes()).toBe(false);
        expect(bad.errors()).toEqual({
            'accepted_if': 'The accepted_if field must be accepted when otherField is true.'
        });

    })


});