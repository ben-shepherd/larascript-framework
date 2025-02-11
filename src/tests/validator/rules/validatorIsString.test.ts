/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import StringRule from '@src/core/domains/validator/rules/StringRule';
import Validator from '@src/core/domains/validator/service/Validator';


describe('test validation', () => {

    test('string, passes', async () => {


        const good = await Validator.make({

            stringField: new StringRule()
        }).validate({
            stringField: 'hello world'
        })
        expect(good.passes()).toBe(true);
        expect(Object.keys(good.errors() || {}).length).toBe(0);


    })

    test('string, fails', async () => {

        const bad = await Validator.make({
            stringField: new StringRule()

        }).validate({
            stringField: 123
        })

        expect(bad.passes()).toBe(false);
        expect(Object.keys(bad.errors() || {}).length).toBe(1);

        const bad2 = await Validator.make({
            stringField: new StringRule()
        }).validate({
            stringField: null
        })

        expect(bad2.passes()).toBe(false);
        expect(Object.keys(bad2.errors() || {}).length).toBe(1);
        
        const bad3 = await Validator.make({
            stringField: new StringRule()
        }).validate({})

        expect(bad3.passes()).toBe(false);
        expect(Object.keys(bad3.errors() || {}).length).toBe(1);


    })



});