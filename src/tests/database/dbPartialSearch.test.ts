/* eslint-disable no-undef */
import { describe, expect, test } from '@jest/globals';
import { App } from '@src/core/services/App';
import testHelper from '@src/tests/testHelper';
import { DataTypes } from 'sequelize';

const connections = testHelper.getTestConnectionNames()

type TData = {
    id?: string,
    name: string,
    createdAt: Date,
    updatedAt: Date
}

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
        await testHelper.testBootApp()

        
        for(const connectionName of connections) {
            await dropTable(connectionName)
            await createTable(connectionName)
        }
    })

    test('test', async () => {

        for(const connectionName of connections) {
            const documentManager = App.container('db').documentManager(connectionName).table('tests')

            App.container('logger').info('connectionName', connectionName)

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
            
            const recordOne = await documentManager.findOne<TData>({ filter: { name: 'Test One'} })
            const recordTwo = await documentManager.findOne<TData>({ filter: { name: 'Test Two'} })

            App.container('logger').info('Created two records', recordOne, recordTwo)
            
            expect(recordOne?.id).toBeTruthy()
            expect(recordTwo?.id).toBeTruthy()

            const recordBothPartial = await documentManager.findMany<TData>({ filter: { name: '%Test%' }, allowPartialSearch: true })
            expect(recordBothPartial?.length).toEqual(2)

            App.container('logger').info('recordBothPartial', recordBothPartial)

            const recordOnePartial = await documentManager.findOne<TData>({ filter: { name: '%One' }, allowPartialSearch: true })
            expect(recordOnePartial?.id === recordOne?.id).toBeTruthy()

            App.container('logger').info('recordOnePartial', recordOnePartial)

            const recordTwoPartial = await documentManager.findOne<TData>({ filter: { name: '%Two' }, allowPartialSearch: true })
            expect(recordTwoPartial?.id === recordTwo?.id).toBeTruthy()

            App.container('logger').info('recordTwoPartial', recordTwoPartial)
        }

    
    })
});