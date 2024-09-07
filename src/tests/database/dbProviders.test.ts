import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import Kernel from '@src/core/Kernel';
import { App } from '@src/core/services/App';
import testAppConfig from '@src/tests/config/testConfig';
import { getTestConnectionNames } from '@src/tests/config/testDatabaseConfig';
import TestDatabaseProvider from '@src/tests/providers/TestDatabaseProvider';
import { DataTypes } from 'sequelize';

const connections = getTestConnectionNames()
const tableName = 'testTable';
type Data = { id?: string, name: string, age: number, relatedId?: string };

const createTable = async (connectionName: string) => {
    const schema = App.container('db').schema(connectionName);
    await schema.createTable(tableName, {
        name: DataTypes.STRING,
        age: DataTypes.INTEGER,
        relatedId: DataTypes.STRING
    });
};

const dropTable = async (connectionName: string) => {
    try {
        const schema = App.container('db').schema(connectionName);
        await schema.dropTable(tableName);
    }
    catch (err) {
    // console.log(err);
    }
};

const createDocument = (): Data => {
    const names = ['John', 'Jane', 'Bob', 'Fred'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomAge = Math.floor(Math.random() * 100);

    return {
        name: randomName,
        age: randomAge
    };
};

describe('DocumentManager Interface Tests', () => {
    beforeAll(async () => {
        await Kernel.boot({
            ...testAppConfig,
            providers: [
                new TestDatabaseProvider()
            ]
        }, {});

        for (const connectionName of connections) {
            await dropTable(connectionName);
            await createTable(connectionName);
        }
    });

    afterAll(async () => {
        for (const connectionName of connections) {
            await dropTable(connectionName);
        }
    });

    test('findById', async () => {
        for (const connectionName of connections) {
            const documentManager = App.container('db').documentManager(connectionName).table(tableName);
            await documentManager.truncate()

            const data = createDocument();
            const insertedDoc = await documentManager.insertOne<Data>(data);
            
            const foundDoc = await documentManager.findById<Data>(insertedDoc.id as string);
            expect(foundDoc).toBeTruthy();
            expect(foundDoc?.id).toEqual(insertedDoc.id);
            expect(foundDoc?.name).toEqual(data.name);
            expect(foundDoc?.age).toEqual(data.age);

            const nonExistentDoc = await documentManager.findById<Data>('non-existent-id');
            expect(nonExistentDoc).toBeNull();
        }
    });

    test('findOne', async () => {
        for (const connectionName of connections) {
            const documentManager = App.container('db').documentManager(connectionName).table(tableName);
            await documentManager.truncate()

            const data = createDocument();
            await documentManager.insertOne<Data>(data);
            
            const foundDoc = await documentManager.findOne<Data>({ filter: { name: data.name } });
            expect(foundDoc).toBeTruthy();
            expect(foundDoc?.name).toEqual(data.name);
            expect(foundDoc?.age).toEqual(data.age);

            const nonExistentDoc = await documentManager.findOne<Data>({ filter: { name: 'Non-existent Name'} });
            expect(nonExistentDoc).toBeNull();
        }
    });

    test('findMany', async () => {
        for (const connectionName of connections) {
            const documentManager = App.container('db').documentManager(connectionName).table(tableName);
            await documentManager.truncate()

            const data1 = createDocument();
            const data2 = createDocument();
            await documentManager.insertMany<Data[]>([data1, data2]);
            
            const foundDocs = await documentManager.findMany<Data[]>({});
            expect(foundDocs.length).toBeGreaterThanOrEqual(2);

            const specificDocs = await documentManager.findMany<Data[]>({ filter: { name: data1.name } });
            expect(specificDocs.length).toBeGreaterThanOrEqual(1);

            const noResults = await documentManager.findMany<Data[]>({ filter: { name: 'Non-existent Name' } });
            expect(noResults.length).toBe(0);
        }
    });

    test('updateOne', async () => {
        for (const connectionName of connections) {
            if(connectionName === 'mongodb') {
                console.log('')
            }
            const documentManager = App.container('db').documentManager(connectionName).table(tableName);
            await documentManager.truncate()

            const data = createDocument();
            const insertedDoc = await documentManager.insertOne<Data>(data);
            
            const updatedData = { ...insertedDoc, name: 'Updated Name' };
            const updatedDoc = await documentManager.updateOne<Data>(updatedData);
            expect(updatedDoc.id).toEqual(insertedDoc.id);
            expect(updatedDoc.name).toEqual('Updated Name');
            expect(updatedDoc.age).toEqual(data.age);
        }
    });

    test('updateMany', async () => {
        for (const connectionName of connections) {
            if(connectionName === 'mongodb') {
                console.log('')
            }
            const documentManager = App.container('db').documentManager(connectionName).table(tableName);
            await documentManager.truncate()

            const data1 = createDocument();
            const data2 = createDocument();
            const insertedDocs = await documentManager.insertMany<Data[]>([data1, data2]);
            
            const updatedData = insertedDocs.map(doc => ({ ...doc, age: 100 }));
            const results = await documentManager.updateMany<Data[]>(updatedData);
            expect(results.length).toBeGreaterThanOrEqual(2);

            const updatedDocs = await documentManager.findMany<Data[]>({ filter: { age: 100 } });
            expect(updatedDocs.length).toBeGreaterThanOrEqual(2);
        }
    });

    test('deleteOne', async () => {
        for (const connectionName of connections) {
            const documentManager = App.container('db').documentManager(connectionName).table(tableName);
            await documentManager.truncate()

            const data = createDocument();
            const insertedDoc = await documentManager.insertOne<Data>(data);
            
            const result = await documentManager.deleteOne<Data>(insertedDoc);
            expect(result).toBeTruthy();

            const foundDoc = await documentManager.findById<Data>(insertedDoc.id as string);
            expect(foundDoc).toBeNull();
        }
    });

    test('deleteMany', async () => {
        for (const connectionName of connections) {
            const documentManager = App.container('db').documentManager(connectionName).table(tableName);
            await documentManager.truncate()

            const data1 = createDocument();
            const data2 = createDocument();
            const insertedDocs = await documentManager.insertMany<Data[]>([data1, data2]);
            
            await documentManager.deleteMany(insertedDocs);
            const results = await documentManager.findMany<Data[]>({});
            expect(results.length).toBe(0);

            const remainingDocs = await documentManager.findMany<Data[]>({});
            expect(remainingDocs.length).toBe(0);
        }
    });

    test('belongsTo', async() => {
        for (const connectionName of connections) {
            const documentManager = App.container('db').documentManager(connectionName).table(tableName);
            await documentManager.truncate()

            const documentOne = await documentManager.insertOne<Data>({
                name: 'John',
                age: 10
            })
            expect(typeof documentOne.id === 'string').toBe(true)
            expect(documentOne.name).toBe('John')
            expect(documentOne.age).toBe(10)

            const relatedDocument = await documentManager.insertOne<Data>({
                name: 'Jane',
                age: 20,
                relatedId: documentOne.id
            })
            expect(typeof relatedDocument.id === 'string').toBe(true)
            expect(relatedDocument.name).toBe('Jane')
            expect(relatedDocument.age).toBe(20)

            console.log('all documents', await documentManager.findMany<Data>({}))

            const foundDocument = await documentManager.belongsTo<Data>(documentOne, {
                localKey: 'id',
                foreignKey: 'relatedId',
                foreignTable: tableName
            })
            expect(foundDocument?.id === relatedDocument.id).toBe(true)
            expect(foundDocument?.name).toBe('Jane')
            expect(foundDocument?.age).toBe(20)
        }
    })

    // test('hasMany', async() => {
    //     for (const connectionName of connections) {
    //         const documentManager = App.container('db').documentManager(connectionName).table(tableName);
    //         await documentManager.truncate()

    //         // todo
    //     }
    // })

    test('truncate', async () => {
        for (const connectionName of connections) {
            const documentManager = App.container('db').documentManager(connectionName).table(tableName);
            await documentManager.truncate()
            
            const data1 = createDocument();
            const data2 = createDocument();
            await documentManager.insertMany<Data[]>([data1, data2]);
            await documentManager.truncate();

            const remainingDocs = await documentManager.findMany<Data[]>({});
            expect(remainingDocs.length).toBe(0);
        }
    });
});