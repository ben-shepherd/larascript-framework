/* eslint-disable no-undef */
import { describe, expect, test } from '@jest/globals';
import Kernel from '@src/core/Kernel';
import testAppConfig from '@src/tests/config/testConfig';
import TestModel from '@src/tests/models/models/TestModel';
import TestDatabaseProvider from '@src/tests/providers/TestDatabaseProvider';

describe('test model attr', () => {

    beforeAll(async () => {
        await Kernel.boot({
            ...testAppConfig,
            providers: [
                ...testAppConfig.providers,
                new TestDatabaseProvider()
            ]
        }, {})
    })

    test('attr', async () => {
        const model = new TestModel({
            name: 'John'
        });
        expect(await model.attr('name')).toEqual('John');

        await model.attr('name', 'Jane');
        expect(await model.attr('name')).toEqual('Jane');

        const modelNoProperties = new TestModel(null);
        await modelNoProperties.attr('name', 'John')
        expect(await modelNoProperties.attr('name')).toEqual('John');
    })
});