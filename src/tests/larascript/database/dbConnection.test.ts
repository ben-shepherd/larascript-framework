/* eslint-disable no-undef */
import { describe, expect } from '@jest/globals';
import MongoDbAdapter from '@src/core/domains/mongodb/adapters/MongoDbAdapter';
import PostgresAdapter from '@src/core/domains/postgres/adapters/PostgresAdapter';
import { App } from '@src/core/services/App';
import testHelper from '@src/tests/testHelper';

describe('attempt to connect to MongoDB database', () => {

    /**
   * Boot the MongoDB provider
   */
    beforeAll(async () => {
        await testHelper.testBootApp()
    })

    /**
   * Test the MongoDB connection
   */
    test('test db connection',async () => {
        const db = App.container('db');
        expect(db.getAdapter('mongodb') instanceof MongoDbAdapter).toBeTruthy();
        expect(db.getAdapter('postgres') instanceof PostgresAdapter).toBeTruthy();

        await db.boot();
        expect(db.getAdapter('mongodb').isConnected()).toBeTruthy();
        expect(db.getAdapter('postgres').isConnected()).toBeTruthy();
    });
});