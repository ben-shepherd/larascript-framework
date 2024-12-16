/* eslint-disable no-undef */
import { describe, expect, test } from '@jest/globals';
import Repository from '@src/core/base/Repository';
import { db } from '@src/core/domains/database/services/Database';
import { logger } from '@src/core/domains/logger/services/LoggerService';
import { IModel } from '@src/core/interfaces/IModel';
import TestDirtyModel from '@src/tests/models/models/TestDirtyModel';
import testHelper from '@src/tests/testHelper';
import { DataTypes } from 'sequelize';

const connections = testHelper.getTestConnectionNames()

const resetTable = async () => {
    for(const connectionName of connections) {
        const schema = db().schema(connectionName)

        if(await schema.tableExists('tests')) {
            await schema.dropTable('tests');
        }

        schema.createTable('tests', {
            name: DataTypes.STRING,
            object: DataTypes.JSON,
            array: DataTypes.JSON,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        })
    }
}


describe('test dirty', () => {

    /**
     * Boot the MongoDB provider
     */
    beforeAll(async () => {
        await testHelper.testBootApp()
    })
    
    test('dirty', async () => {
        for(const connectionName of connections) {
            logger().console('[Connection]', connectionName)
            await resetTable()


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
            expect((modelTwo.getAttributeSync('array') as string[])?.length).toEqual(3)
            expect((modelTwo.getOriginal('array') as string[])?.length).toEqual(2)

            modelTwo.attr('object', {
                a: 2,
                b: 2
            })
            expect(modelTwo.isDirty()).toBeTruthy();
            expect(Object.keys(modelTwo.getDirty() ?? {}).includes('object')).toBeTruthy()
            expect((modelTwo.getAttributeSync('object') as {a: number, b: number})?.a).toEqual(2)
            expect((modelTwo.getAttributeSync('object') as {a: number, b: number})?.b).toEqual(2)
            expect((modelTwo.getOriginal('object') as {a: number, b: number})?.a).toEqual(1)
            expect((modelTwo.getOriginal('object') as {a: number, b: number})?.b).toEqual(1)
        }
    })
});