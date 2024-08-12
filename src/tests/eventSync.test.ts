import { describe } from '@jest/globals';
import Kernel from '@src/core/Kernel';
import { App } from '@src/core/services/App';
import TestSubscriber from './events/subscribers/TestSyncSubscriber';
import TestEventProvider from './providers/TestEventProvider';

describe('mock event service', () => {

  beforeAll(async () => {
    await Kernel.boot({
      environment: 'testing',
      providers: [
        new TestEventProvider()
      ],
      commands: []
    }, {})
  })

  test('test dispatch event sync', () => {
    App.container('events').dispatch(new TestSubscriber({ hello: 'world' }));
    expect(true).toBeTruthy()
  })
}); 