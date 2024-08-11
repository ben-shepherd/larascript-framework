import { describe, expect, test } from '@jest/globals';
import testAppConfig from '@src/config/test';
import MongoDB from '@src/core/domains/database/mongodb/services/MongoDB';
import Kernel from '@src/core/Kernel';
import MongoDBProvider from '@src/core/providers/MongoDBProvider';
import { App } from '@src/core/services/App';

describe('dbConnection module', () => {
  test('success db connection', async () => {
    
    await Kernel.boot({
        ...testAppConfig,
        providers: [
            new MongoDBProvider()
        ]
    }, {})

    const mongodb = App.container('mongodb');

    expect(mongodb).toBeInstanceOf(MongoDB);

    mongodb.connectDefaultConnection();

    expect(mongodb.getDb()).toBeTruthy();
  });
});