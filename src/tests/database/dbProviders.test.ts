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
    catch (err) {}
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

describe('Combined DocumentManager Interface Test', () => {
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

    test('All DocumentManager operations', async () => {
        for (const connectionName of connections) {
            console.log('[Connection]', connectionName);

            const documentManager = App.container('db').documentManager(connectionName).table(tableName);
            await documentManager.truncate();

            // Test insertOne and findById
            console.log('--- Testing insertOne and findById ---');
            await documentManager.truncate()
            const data = createDocument();
            const insertedDoc = await documentManager.insertOne<Data>(data);
            
            const foundDoc = await documentManager.findById<Data>(insertedDoc.id as string);
            expect(foundDoc).toBeTruthy();
            expect(foundDoc?.id).toEqual(insertedDoc.id);
            expect(foundDoc?.name).toEqual(insertedDoc.name);
            expect(foundDoc?.age).toEqual(insertedDoc.age);

            const nonExistentDoc = await documentManager.findById<Data>('non-existent-id');
            expect(nonExistentDoc).toBeNull();

            // Test findOne
            console.log('--- Testing findOne ---');
            await documentManager.truncate()
            const findOneData = createDocument()
            await documentManager.insertOne(findOneData)
            const foundOneDoc = await documentManager.findOne<Data>({ filter: { name: findOneData.name } });
            expect(foundOneDoc).toBeTruthy();
            expect(foundOneDoc?.name).toEqual(findOneData.name);
            expect(foundOneDoc?.age).toEqual(findOneData.age);

            const nonExistentOneDoc = await documentManager.findOne<Data>({ filter: { name: 'Non-existent Name'} });
            expect(nonExistentOneDoc).toBeNull();

            // Test insertMany and findMany
            console.log('--- Testing insertMany and findMany ---');
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

            // Test updateOne
            console.log('--- Testing updateOne ---');
            await documentManager.truncate()
            const updateOneData = createDocument()
            const updateOneInsertedDocument = await documentManager.insertOne<Data>(updateOneData);
            await documentManager.updateOne<Data>({ ...updateOneInsertedDocument, name: 'Updated Name' });
            const updatedDoc = await documentManager.findById<Data>(updateOneInsertedDocument.id as string);
            expect(updatedDoc?.id).toEqual(updateOneInsertedDocument.id);
            expect(updatedDoc?.name).toEqual('Updated Name');
            expect(updatedDoc?.age).toEqual(updateOneData.age);

            // Test updateMany
            console.log('--- Testing updateMany ---');
            await documentManager.truncate()
            await documentManager.insertMany<Data[]>([createDocument(), createDocument(), createDocument()]);
            const allDocs = await documentManager.findMany<Data[]>({});
            expect(allDocs.length).toBeGreaterThanOrEqual(3);
            const docsToUpdate = allDocs.map(doc => ({ ...doc, age: 100 }));
            await documentManager.updateMany<Data[]>(docsToUpdate);
            const updatedDocs = await documentManager.findMany<Data[]>({ filter: { age: 100 } });
            expect(updatedDocs.length).toBeGreaterThanOrEqual(3);

            // Test belongsTo
            console.log('--- Testing belongsTo ---');
            const parentDoc = await documentManager.insertOne<Data>({
                name: 'Parent',
                age: 50
            });
            const childDoc = await documentManager.insertOne<Data>({
                name: 'Child',
                age: 25,
                relatedId: parentDoc.id
            });

            const relatedChildDoc = await documentManager.belongsTo<Data>(parentDoc, {
                localKey: 'id',
                foreignKey: 'relatedId',
                foreignTable: tableName
            });
            expect(relatedChildDoc?.id).toEqual(childDoc.id);
            expect(relatedChildDoc?.name).toEqual('Child');
            expect(relatedChildDoc?.age).toEqual(childDoc.age);

            // Test deleteOne
            console.log('--- Testing deleteOne ---');
            await documentManager.truncate()
            const docToDelete = await documentManager.insertOne<Data>(createDocument());
            await documentManager.deleteOne<Data>(docToDelete);
            const deleteOneResult = await documentManager.findMany<Data[]>({});
            expect(deleteOneResult.length).toBe(0);

            const deletedDoc = await documentManager.findById<Data>(docToDelete.id as string);
            expect(deletedDoc).toBeNull();

            // Test deleteMany
            console.log('--- Testing deleteMany ---');
            await documentManager.truncate()
            await documentManager.insertMany<Data[]>([createDocument(), createDocument(), createDocument()]);
            const docsBeforeDelete = await documentManager.findMany<Data[]>({});
            expect(docsBeforeDelete.length).toBeGreaterThanOrEqual(3);
            await documentManager.deleteMany(docsBeforeDelete);
            const remainingDocs = await documentManager.findMany<Data[]>({});
            expect(remainingDocs.length).toBe(0);

            // Test truncate
            console.log('--- Testing truncate ---');
            await documentManager.insertMany<Data[]>([createDocument(), createDocument()]);
            await documentManager.truncate();
            await documentManager.findMany<Data[]>({});
            const docsAfterTruncate = await documentManager.findMany<Data[]>({});
            expect(docsAfterTruncate.length).toBe(0);
        }
    });
});