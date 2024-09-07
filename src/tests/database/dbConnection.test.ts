import { describe, expect } from '@jest/globals';
import Kernel from '@src/core/Kernel';
import DatabaseProvider from '@src/core/domains/database/providers/DatabaseProvider';
import { App } from '@src/core/services/App';
import testAppConfig from '@src/tests/config/testConfig';

describe('attempt to connect to MongoDB database', () => {

    /**
   * Boot the MongoDB provider
   */
    beforeAll(async () => {
        await Kernel.boot({
            ...testAppConfig,
            providers: [
                new DatabaseProvider()
            ]
        }, {})
    })

    /**
   * Test the MongoDB connection
   */
    test('test db connection',async () => {
        const db = App.container('db');
        expect(db).toBeTruthy();

        await db.boot();
        expect(db).toBeTruthy();
    });
});