import Kernel from '@src/core/Kernel';

import { describe, expect } from '@jest/globals';
import { App } from '@src/core/services/App';
import testAppConfig from '@src/tests/config/testConfig';
import { DataTypes } from 'sequelize';
import TestDatabaseProvider from '../providers/TestDatabaseProvider';

describe('db complete test', () => {

    const connections = ['mongodb', 'postgres']
    const tableName = 'testTable';
    type DocumentData = { id?: string, name: string, age: number }

    beforeAll(async () => {
        await Kernel.boot({
            ...testAppConfig,
            providers: [
                new TestDatabaseProvider()
            ]
        }, {})

        /**
         * Re-create tables
         */
        for(const connectionName of connections)
        {
            const schema = App.container('db').schema(connectionName);

            if(await schema.tableExists(tableName)) {
                await schema.dropTable(tableName);
            }

            await schema.createTable(tableName, {
                name: DataTypes.STRING,
                age: DataTypes.INTEGER
            })
        }
    })

    test(`test db service`, async () => {
        let db = App.container('db');

        Object.values(connections).forEach((connectionName: string) => {
            expect(db.getClient(connectionName)).toBeTruthy();
            expect(db.provider(connectionName)).toBeTruthy();
            expect(db.documentManager(connectionName)).toBeTruthy();
            expect(db.schema(connectionName)).toBeTruthy();
        })
    });

    test(`test db is connected`, async () => {
        let db = App.container('db');

        Object.values(connections).forEach((connectionName: string) => {
            expect(db.provider(connectionName).isConnected()).toBeTruthy();
        })
    })

    test('test schema create table', async() => {
        let db = App.container('db');

        for(const connectionName of connections)
        {
            console.log('[Connection]:', connectionName);
            const schema = db.schema(connectionName);
            
            const created = await schema.tableExists(tableName)
            console.log('IsCreated', connectionName, created);

            expect(created).toBeTruthy();
        }
    })

    test('test document manager', async() => {
        let db = App.container('db');

        for(const connectionName of connections)
        {
            console.log('[Connection]:', connectionName);
            const documentManager = db.documentManager(connectionName).table(tableName);

            /**
             * Create an original document
             */
            let originalDocument: DocumentData = {
                name: 'John',
                age: 30
            }

            originalDocument = await documentManager.insertOne(originalDocument);
            expect(typeof originalDocument.id === 'string').toBe(true);
            expect(originalDocument.name).toEqual('John');
            expect(originalDocument.age).toEqual(30);


            /**
             * Fetch the document
             */
            let fetchedDocument: DocumentData | null = await documentManager.findOne<DocumentData>({
                filter: {
                    name: originalDocument.name
                }
            });
            expect(typeof fetchedDocument?.id === 'string').toBe(true);
            expect(fetchedDocument?.name).toEqual('John');
            expect(fetchedDocument?.age).toEqual(30);

            /**
             * Fetch all documents and check the results
             */
            let results = await documentManager.findMany({})
            expect(results.length > 0).toBe(true);

            /**
             * Update the document
             */
            originalDocument.name = 'Jane';
            const updatedDocument: DocumentData | null = await documentManager.updateOne(originalDocument);
            expect(typeof updatedDocument?.id === 'string').toBe(true);
            expect(typeof updatedDocument?.id === 'string' && updatedDocument?.id === originalDocument.id).toBe(true);
            expect(updatedDocument?.name).toEqual('Jane');
        }
    })

    // test('test document manager delete', async() => {
    //     let db = App.container('db');

    //     for(const connectionName of connections)
    //     {
    //         console.log('[Connection]:', connectionName);
    //         await db.documentManager(connectionName).deleteOne({ name: 'Jane' }) 
    //         const results = await db.documentManager().findMany({})
    //         expect(results.length).toEqual(0);

    //         /**
    //          * Insert multiple documents and then deleteMany
    //          */
    //         const ['John', 'Jane']
    //     }
    // })
})