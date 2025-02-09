/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import IsArray from '@src/core/domains/validator/rules/IsArray';
import IsObject from '@src/core/domains/validator/rules/IsObject';
import IsString from '@src/core/domains/validator/rules/IsString';
import Required from '@src/core/domains/validator/rules/Required';
import Validator from '@src/core/domains/validator/service/Validator';


describe('test validation', () => {

    test('simple required name and string, passes', async () => {

        const data = {
            name: 'John Doe',
        }

        const result = await Validator.make({
            name: [new Required(), new IsString()]
        }).validate(data);

        expect(result.passes()).toBe(true);

    })

    test('validates nested object using dot notation', async () => {
        const data = {
            user: {
                name: 'John Doe',
                email: 'john@example.com'
            }
        };

        const result = await Validator.make({
            'user': [new Required(), new IsObject()],
            'user.name': [new Required(), new IsString()],
            'user.email': [new Required(), new IsString()]
        }).validate(data);

        expect(result.passes()).toBe(true);
    });

    test('validates array of objects using dot notation', async () => {
        const data = {
            people: [
                { name: 'John Doe', age: 30 },
                { name: 'Jane Doe', age: 25 }
            ]
        };

        const result = await Validator.make({
            'people': [new Required(), new IsArray()],
            'people.*.name': [new Required(), new IsString()],
            'people.0': [new Required(), new IsObject()],
            'people.1.name': [new Required(), new IsString()],
        }).validate(data);

        expect(result.passes()).toBe(true);
    });

    test('validates specific array index fails when invalid', async () => {
        const data = {
            people: [
                { name: 'John Doe', age: 30 },
                { name: 123, age: 25 } // Invalid: name should be string
            ]
        };

        const result = await Validator.make({
            'people': [new Required(), new IsArray()],
            'people.*.name': [new Required(), new IsString()]
        }).validate(data);

        expect(result.passes()).toBe(false);
        // expect(result.errors().has('people.1.name')).toBe(true);
    });

    test('validates deep nested objects with arrays', async () => {
        const data = {
            company: {
                name: 'Acme Corp',
                departments: [
                    {
                        name: 'Engineering',
                        employees: [
                            { name: 'John', role: 'Developer' },
                            { name: 'Jane', role: 'Designer' }
                        ]
                    }
                ]
            }
        };

        const result = await Validator.make({
            'company': [new Required(), new IsObject()],
            'company.name': [new Required(), new IsString()],
            'company.departments': [new Required(), new IsArray()],
            'company.departments.*.name': [new Required(), new IsString()],
            'company.departments.*.employees': [new Required(), new IsArray()],
            'company.departments.*.employees.*.name': [new Required(), new IsString()],
            'company.departments.*.employees.*.role': [new Required(), new IsString()]
        }).validate(data);

        expect(result.passes()).toBe(true);
    });

});