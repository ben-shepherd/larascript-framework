/* eslint-disable no-undef */
import { describe, expect } from '@jest/globals';
import Database, { db } from '@src/core/domains/database/services/Database';
import MongoDbAdapter from '@src/core/domains/mongodb/adapters/MongoDbAdapter';
import PostgresAdapter from '@src/core/domains/postgres/adapters/PostgresAdapter';
import { app } from '@src/core/services/App';
import TestMigrationModel from '@src/tests/migration/models/TestMigrationModel';
import testHelper, { forEveryConnection } from '@src/tests/testHelper';
import { MongoClient } from 'mongodb';
import pg from 'pg';

describe('db service', () => {

    let migrationTableName!: string;

    /**
     * Boot the MongoDB provider
     */
    beforeAll(async () => {
        await testHelper.testBootApp()

        migrationTableName = TestMigrationModel.getTable()

        for(const connectionName of testHelper.getTestConnectionNames()) {
            await db().schema(connectionName).dropTable(migrationTableName);
        }
    })


    test('check db service',async () => {
        const db = app('db');

        const expectedConnectionsInConfig = ['mongodb', 'postgres'];
        const actualConnectionsInConfig = db.getConfig().connections.map(c => c.connectionName);

        for(const connectionName of expectedConnectionsInConfig) {
            expect(actualConnectionsInConfig.includes(connectionName)).toBe(true);
        }

        expect(db instanceof Database).toBeTruthy();
        
        // Check adapters
        expect(db.getAdapter('mongodb') instanceof MongoDbAdapter).toBeTruthy();
        expect(db.getAdapter('postgres') instanceof PostgresAdapter).toBeTruthy();

        // Check connection adapter
        expect(db.isConnectionAdapter(MongoDbAdapter, 'mongodb')).toBe(true);
        expect(db.isConnectionAdapter(PostgresAdapter, 'postgres')).toBe(true);
        
        // Check clients
        if(testHelper.getTestConnectionNames().includes('mongodb')) {
            expect(db.getAdapter('mongodb').getClient() instanceof MongoClient).toBeTruthy();
        }
        if(testHelper.getTestConnectionNames().includes('postgres')) {
            expect(db.getAdapter('postgres').getPool() instanceof pg.Pool).toBeTruthy();
        }

        // Check default connection name
        expect(db.getDefaultConnectionName() === 'postgres').toBe(true);
        db.setDefaultConnectionName('mongodb');
        expect(db.getDefaultConnectionName() === 'mongodb').toBe(true);
        
        // Check adapter constructor
        expect(typeof db.getAdapterConstructor('mongodb')).toBe('function');
        expect(typeof db.getAdapterConstructor('postgres')).toBe('function');

        // Check schema
        const schema = db.schema();
        expect(typeof schema.createTable === 'function').toBe(true);
        expect(typeof schema.dropTable === 'function').toBe(true);
        expect(typeof schema.tableExists === 'function').toBe(true);
        expect(typeof schema.createDatabase === 'function').toBe(true);
        expect(typeof schema.dropDatabase === 'function').toBe(true);

        // Check default credentials are a string
        for(const connectionConfig of db.getConfig().connections) {
            expect(typeof db.getDefaultCredentials(connectionConfig.connectionName)  === 'string').toBe(true);
        }
        
        // Check create migration schema
        await forEveryConnection(async (connectionName) => {    
            await db.getAdapter(connectionName).createMigrationSchema(migrationTableName);
            const tableExists = await db.schema(connectionName).tableExists(migrationTableName);
            expect(tableExists).toBe(true);
        })
    });
});