/* eslint-disable no-undef */
import { describe, expect, test } from '@jest/globals';
import Kernel from '@src/core/Kernel';
import { IDocumentManager } from '@src/core/domains/database/interfaces/IDocumentManager';
import { App } from '@src/core/services/App';
import testAppConfig from '@src/tests/config/testConfig';
import { getTestConnectionNames } from '@src/tests/config/testDatabaseConfig';
import TestDatabaseProvider from '@src/tests/providers/TestDatabaseProvider';
import { DataTypes } from 'sequelize';

const connections = getTestConnectionNames()

const createTable = async (connectionName: string) => {
    const schema = App.container('db').schema(connectionName)

    schema.createTable('tests', {
        name: DataTypes.STRING,
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


describe('test partial search', () => {

    beforeAll(async () => {
        await Kernel.boot({
            ...testAppConfig,
            providers: [
                new TestDatabaseProvider()
            ]
        }, {})

        
        for(const connectionName of connections) {
            await dropTable(connectionName)
            await createTable(connectionName)
        }
    })

    test('test', async () => {

        for(const connectionName of connections) {
            const documentManager = App.container('db').documentManager(connectionName).table('tests') as IDocumentManager

            console.log('connectionName', connectionName)

            const recordOneData = {
                name: 'Test One',
                createdAt: new Date(),
                updatedAt: new Date()
            }
            const recordTwoData = {
                name: 'Test Two',
                createdAt: new Date(),
                updatedAt: new Date()
            }
            
            await documentManager.insertOne(recordOneData)
            await documentManager.insertOne(recordTwoData)
            
            const recordOne = await documentManager.findOne({ filter: { name: 'Test One'} })
            const recordTwo = await documentManager.findOne({ filter: { name: 'Test Two'} })

            console.log('Created two records', recordOne, recordTwo)
            
            expect(recordOne.id).toBeTruthy()
            expect(recordTwo.id).toBeTruthy()

            const recordBothPartial = await documentManager.findMany({ filter: { name: '%Test%' }, allowPartialSearch: true })
            expect(recordBothPartial.length).toEqual(2)

            console.log('recordBothPartial', recordBothPartial)

            const recordOnePartial = await documentManager.findOne({ filter: { name: '%One' }, allowPartialSearch: true })
            expect(recordOnePartial?.id === recordOne.id).toBeTruthy()

            console.log('recordOnePartial', recordOnePartial)

            const recordTwoPartial = await documentManager.findOne({ filter: { name: '%Two' }, allowPartialSearch: true })
            expect(recordTwoPartial?.id === recordTwo.id).toBeTruthy()

            console.log('recordTwoPartial', recordTwoPartial)
        }

    
    })
});