/* eslint-disable no-undef */
import { describe, expect } from '@jest/globals';
import Database from '@src/core/domains/database/services/Database';
import MongoDbAdapter from '@src/core/domains/mongodb/adapters/MongoDbAdapter';
import PostgresAdapter from '@src/core/domains/postgres/adapters/PostgresAdapter';
import { app } from '@src/core/services/App';
import TestMigrationModel from '@src/tests/migration/models/TestMigrationModel';
import testHelper from '@src/tests/testHelper';
import { MongoClient } from 'mongodb';
import { Sequelize } from 'sequelize';

describe('db service', () => {

    
    let migrationTableName!: string;


    /**
     * Boot the MongoDB provider
     */
    beforeAll(async () => {
        await testHelper.testBootApp()

        migrationTableName = new TestMigrationModel(null).table;

        const db = app('db');

        for(const connectionConfig of db.getConfig().connections) {
            await db.schema(connectionConfig.connectionName).dropTable(migrationTableName);
        }
    })


    test('check db service',async () => {
        const db = app('db');

        const expectedConnections = ['mongodb', 'postgres'];
        const actualConnections = db.getConfig().connections.map(c => c.connectionName);

        for(const connectionName of expectedConnections) {
            expect(actualConnections.includes(connectionName)).toBe(true);
        }

        expect(db instanceof Database).toBeTruthy();
        
        // Check adapters
        expect(db.getAdapter('mongodb') instanceof MongoDbAdapter).toBeTruthy();
        expect(db.getAdapter('postgres') instanceof PostgresAdapter).toBeTruthy();

        // Check connection adapter
        expect(db.isConnectionAdapter(MongoDbAdapter, 'mongodb')).toBe(true);
        expect(db.isConnectionAdapter(PostgresAdapter, 'postgres')).toBe(true);
        
        // Check clients
        expect(db.getAdapter<MongoDbAdapter>('mongodb').getClient() instanceof MongoClient).toBeTruthy();
        expect(db.getAdapter<PostgresAdapter>('postgres').getClient() instanceof Sequelize).toBeTruthy();

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
        for(const connectionConfig of db.getConfig().connections) {
            await db.createMigrationSchema(migrationTableName, connectionConfig.connectionName);
            const tableExists = await db.schema(connectionConfig.connectionName).tableExists(migrationTableName);
            expect(tableExists).toBe(true);
        }
    });
});