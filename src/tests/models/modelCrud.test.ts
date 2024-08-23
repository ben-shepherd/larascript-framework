import { describe, expect, test } from '@jest/globals';
import Kernel from '@src/core/Kernel';
import MongoDBProvider from '@src/core/domains/database/mongodb/providers/MongoDBProvider';
import testAppConfig from '@src/tests/config/testConfig';
import TestModel from '@src/tests/models/models/TestModel';
import testModelsHelper from '@src/tests/models/testModelsHelper';

describe('test model crud operations', () => {

    /**
     * Boot the MongoDB provider
     */
    beforeAll(async () => {
        await Kernel.boot({
            ...testAppConfig,
            providers: [
                new MongoDBProvider()
            ]
        }, {})

        await testModelsHelper.cleanupCollections()
    })

    let modelInstance: TestModel;

    /**
     * Create test model
     */
    test('create test model', async () => {
        modelInstance = new TestModel({
            name: 'nameValue'
        });
        expect(modelInstance.getAttribute('name')).toEqual('nameValue');

        await modelInstance.save();
        expect(modelInstance.getId()).toBeTruthy();
    })

    /**
     * Test changing attribute value
     */
    test('test changing attribute value', async () => {
        modelInstance.setAttribute('name', 'differentNameValue');
        await modelInstance.update();
        await modelInstance.refresh();
        expect(modelInstance.getAttribute('name')).toEqual('differentNameValue');
    })
});