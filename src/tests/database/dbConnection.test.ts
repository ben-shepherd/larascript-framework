import { describe, expect } from '@jest/globals';
import testAppConfig from '@src/config/test';
import MongoDBProvider from '@src/core/domains/database/mongodb/providers/MongoDBProvider';
import MongoDB from '@src/core/domains/database/mongodb/services/MongoDB';
import Kernel from '@src/core/Kernel';
import { App } from '@src/core/services/App';

describe('attempt to connect to MongoDB database', () => {

  /**
   * Boot the MongoDB provider
   */
  beforeAll(async () => {
    await Kernel.boot({
      ...testAppConfig,
      providers: [
        new MongoDBProvider()
      ]
    }, {})
  })

  /**
   * Test the MongoDB connection
   */
  test('test MongoDB connection',async () => {
    const mongodb = App.container('mongodb');
    expect(mongodb).toBeInstanceOf(MongoDB);

    mongodb.connectDefaultConnection();
    expect(mongodb.getDb()).toBeTruthy();
  });
});