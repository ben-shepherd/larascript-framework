/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import RequiredRule from '@src/core/domains/validator/rules/RequiredRule';
import Validator from '@src/core/domains/validator/service/Validator';


describe('test validation', () => {

    test('required, passes', async () => {

        const validAcceptedValues = [
            { requiredField: 'hello world' },
            { requiredField: 123 },
            { requiredField: true },
            { requiredField: 'true' }
        ];

        for (const data of validAcceptedValues) {

            const good = await Validator.make({
                requiredField: new RequiredRule()
            }).validate(data)
            expect(good.passes()).toBe(true);
            expect(Object.keys(good.errors() || {}).length).toBe(0);
    
        }

    })

    test('required, fails', async () => {

        const bad = await Validator.make({
            requiredField: new RequiredRule()
        }).validate({
            requiredField: ''
        })
        expect(bad.passes()).toBe(false);
        expect(Object.keys(bad.errors() || {}).length).toBe(1);

        const bad2 = await Validator.make({
            requiredField: new RequiredRule()
        }).validate({
            requiredField: null
        })
        expect(bad2.passes()).toBe(false);
        expect(Object.keys(bad2.errors() || {}).length).toBe(1);
        
        const bad3 = await Validator.make({
            requiredField: new RequiredRule()
        }).validate({})

        expect(bad3.passes()).toBe(false);
        expect(Object.keys(bad3.errors() || {}).length).toBe(1);


    })



});