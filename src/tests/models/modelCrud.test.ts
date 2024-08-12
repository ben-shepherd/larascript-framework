import { describe, expect, test } from '@jest/globals';
import testAppConfig from '@src/config/test';
import Model from '@src/core/base/Model';
import Kernel from '@src/core/Kernel';
import MongoDBProvider from '@src/core/providers/MongoDBProvider';

type TestModelData = {
    name: string
}

class TestModel extends Model<TestModelData> {
    public collection: string = 'tests';

    public fields: string[] = [
        'name',
        'createdAt',
        'updatedAt'
    ]
}

describe('test model crud operations', () => {

    test('kernel boot', async () => {
        await Kernel.boot({
            ...testAppConfig,
            providers: [
                new MongoDBProvider()
            ]
        }, {})
    })

    let modelInstance: TestModel;

    test('create test model', async () => {
        modelInstance = new TestModel({
            name: 'nameValue'
        });
        expect(modelInstance.getAttribute('name')).toEqual('nameValue');

        await modelInstance.save();
        expect(modelInstance.getId()).toBeTruthy();
    })

    test('test changing attribute value', async () => {
        modelInstance.setAttribute('name', 'differentNameValue');
        await modelInstance.update();
        await modelInstance.refresh();
        expect(modelInstance.getAttribute('name')).toEqual('differentNameValue');
    })

    test('test deleting model', async () => {
        await modelInstance.delete();
        expect(modelInstance.data).toBeNull();
    });
});