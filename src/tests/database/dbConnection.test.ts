import { describe, expect } from '@jest/globals';
import Kernel from '@src/core/Kernel';
import DatabaseProvider from '@src/core/domains/database/providers/DatabaseProvider';
import MongoDB from '@src/core/domains/database/services/mongodb/MongoDB';
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
  test('test MongoDB connection',async () => {
    const mongodb = App.container('mongodb');
    expect(mongodb).toBeInstanceOf(MongoDB);

    mongodb.connectDefaultConnection();
    expect(mongodb.getDb()).toBeTruthy();
  });
});