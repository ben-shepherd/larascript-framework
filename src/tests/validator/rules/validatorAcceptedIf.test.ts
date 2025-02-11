/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import AcceptedIf from '@src/core/domains/validator/rules/AcceptedIf';
import Validator from '@src/core/domains/validator/service/Validator';


describe('test validation', () => {

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
            'accepted_if': ['The accepted_if field must be accepted when otherField is true.']
        });

    })


});