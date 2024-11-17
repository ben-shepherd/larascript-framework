/* eslint-disable no-undef */
import { describe, expect } from '@jest/globals';
import Database from '@src/core/domains/database/services/Database';
import MongoDbAdapter from '@src/core/domains/mongodb/adapters/MongoDbAdapter';
import PostgresAdapter from '@src/core/domains/postgres/adapters/PostgresAdapter';
import { App } from '@src/core/services/App';
import testHelper from '@src/tests/testHelper';
import { MongoClient } from 'mongodb';
import { Sequelize } from 'sequelize';

import TestMigrationModel from '../migration/models/TestMigrationModel';

describe('attempt to connect to MongoDB database', () => {

    
    let migrationTableName!: string;


    /**
     * Boot the MongoDB provider
     */
    beforeAll(async () => {
        await testHelper.testBootApp()

        migrationTableName = new TestMigrationModel(null).table;

        const db = App.container('db');

        for(const connectionConfig of db.getConfig().connections) {
            await db.schema(connectionConfig.connectionName).dropTable(migrationTableName);
        }
    })

    /**
   * Test the MongoDB connection
   */
    test('test db connection',async () => {
        const db = App.container('db');

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
        expect(db.getClient('mongodb') instanceof MongoClient).toBeTruthy();
        expect(db.getClient('postgres') instanceof Sequelize).toBeTruthy();

        // Check default connection name
        expect(db.getDefaultConnectionName() === 'postgres').toBe(true);

        db.setDefaultConnectionName('mongodb');

        expect(db.getDefaultConnectionName() === 'mongodb').toBe(true);
        
        // Check adapter constructor
        expect(typeof db.getAdapterConstructor('mongodb')).toBe('function');
        expect(typeof db.getAdapterConstructor('postgres')).toBe('function');

        // Check document manager
        const documentManager = db.documentManager();
        expect(typeof documentManager.findById === 'function').toBe(true);
        expect(typeof documentManager.insertOne === 'function').toBe(true);
        expect(typeof documentManager.updateOne === 'function').toBe(true);
        expect(typeof documentManager.deleteOne === 'function').toBe(true);

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