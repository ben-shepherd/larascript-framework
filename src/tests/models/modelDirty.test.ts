/* eslint-disable no-undef */
import { describe, expect, test } from '@jest/globals';
import Repository from '@src/core/base/Repository';
import { IModel } from '@src/core/interfaces/IModel';
import { App } from '@src/core/services/App';
import TestDirtyModel from '@src/tests/models/models/TestDirtyModel';
import { DataTypes } from 'sequelize';

import testHelper from '../testHelper';

const connections = testHelper.getTestConnectionNames()

const createTable = async (connectionName: string) => {
    const schema = App.container('db').schema(connectionName)

    schema.createTable('tests', {
        name: DataTypes.STRING,
        object: DataTypes.JSON,
        array: DataTypes.JSON,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    })
}

const dropTable = async (connectionName: string) => {
    const schema = App.container('db').schema(connectionName)

    if(await schema.tableExists('tests')) {
        await schema.dropTable('tests');
    }
}

const truncate = async (connectionName: string) => {
    await App.container('db').documentManager(connectionName).table('tests').truncate()
}

describe('test dirty', () => {

    /**
     * Boot the MongoDB provider
     */
    beforeAll(async () => {
        await testHelper.testBootApp()

        for(const connection of connections) {
            await dropTable(connection)
            await createTable(connection)
        }
    })
    
    test('dirty', async () => {
        for(const connectionName of connections) {
            App.container('logger').info('[Connection]', connectionName)
            App.container('db').setDefaultConnectionName(connectionName);

            await truncate(connectionName);


            /**
             * Create author model
             */
            const modelOne = new TestDirtyModel({
                name: 'John',
                array: ['a', 'b'],
                object: {
                    a: 1,
                    b: 1
                }
            })
            expect(modelOne.isDirty()).toBeFalsy();

            modelOne.attr('name', 'Jane')
            expect(modelOne.isDirty()).toBeTruthy();
            expect(Object.keys(modelOne.getDirty() ?? {}).includes('name')).toBeTruthy()
            expect(modelOne.getOriginal('name') === 'John')

            modelOne.attr('array', ['a', 'b', 'c'])
            expect(modelOne.isDirty()).toBeTruthy();
            expect(Object.keys(modelOne.getDirty() ?? {}).includes('array')).toBeTruthy()
            expect((modelOne.getOriginal('array') as string[])?.length).toEqual(2)

            modelOne.attr('object', {
                a: 2,
                b: 2
            })
            expect(modelOne.isDirty()).toBeTruthy();
            expect(Object.keys(modelOne.getDirty() ?? {}).includes('object')).toBeTruthy()
            expect((modelOne.getOriginal('object') as {a: number, b: number})?.a).toEqual(1)
            expect((modelOne.getOriginal('object') as {a: number, b: number})?.b).toEqual(1)

            await modelOne.save();
            expect(modelOne.isDirty()).toBeFalsy();

            modelOne.attr('name', 'Bob')
            expect(modelOne.isDirty()).toBeTruthy()
            expect(Object.keys(modelOne.getDirty() ?? {}).includes('name')).toBeTruthy()
            expect(modelOne.getOriginal('name') === 'Jane')

            await modelOne.delete();
            expect(modelOne.isDirty()).toBeFalsy();

            await (new TestDirtyModel({
                name: 'John',
                array: ['a', 'b'],
                object: {
                    a: 1,
                    b: 1
                }
            })).save()
            const repository = new Repository(TestDirtyModel);

            const modelTwo = await repository.findOne({name: 'John'}) as IModel
            expect(modelTwo).toBeTruthy()
            expect(modelTwo).toBeInstanceOf(TestDirtyModel);
            expect(modelTwo.isDirty()).toBeFalsy();

            modelTwo.attr('name', 'Jane')
            expect(modelTwo.isDirty()).toBeTruthy();
            expect(Object.keys(modelTwo.getDirty() ?? {}).includes('name')).toBeTruthy()
            expect(modelTwo.getOriginal('name') === 'John')

            modelTwo.attr('array', ['a', 'b', 'c'])
            expect(modelTwo.isDirty()).toBeTruthy();
            expect(Object.keys(modelTwo.getDirty() ?? {}).includes('array')).toBeTruthy()
            expect((modelTwo.getAttribute('array') as string[])?.length).toEqual(3)
            expect((modelTwo.getOriginal('array') as string[])?.length).toEqual(2)

            modelTwo.attr('object', {
                a: 2,
                b: 2
            })
            expect(modelTwo.isDirty()).toBeTruthy();
            expect(Object.keys(modelTwo.getDirty() ?? {}).includes('object')).toBeTruthy()
            expect((modelTwo.getAttribute('object') as {a: number, b: number})?.a).toEqual(2)
            expect((modelTwo.getAttribute('object') as {a: number, b: number})?.b).toEqual(2)
            expect((modelTwo.getOriginal('object') as {a: number, b: number})?.a).toEqual(1)
            expect((modelTwo.getOriginal('object') as {a: number, b: number})?.b).toEqual(1)
        }
    })
});