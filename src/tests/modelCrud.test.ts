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

describe('modelCrud module', () => {
  test('test CRUD operations', async () => {
    
    await Kernel.boot({
        ...testAppConfig,
        providers: [
            new MongoDBProvider()
        ]
    }, {})

    const modelInstance = new TestModel({
        name: 'nameValue'
    });

    expect(modelInstance.getAttribute('name')).toEqual('nameValue');

    await modelInstance.save();

    expect(modelInstance.getId()).toBeTruthy();

    modelInstance.setAttribute('name', 'differentNameValue');
    await modelInstance.update();
    await modelInstance.refresh();

    expect(modelInstance.getAttribute('name')).toEqual('differentNameValue');

    await modelInstance.delete();

    expect(modelInstance.data).toBeNull();
  });
});