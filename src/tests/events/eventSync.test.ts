import { describe } from '@jest/globals';
import Kernel from '@src/core/Kernel';
import { App } from '@src/core/services/App';
import TestSubscriber from '@src/tests/events/subscribers/TestSyncSubscriber';
import TestEventProvider from '@src/tests/providers/TestEventProvider';
import TestConsoleProvider from '../providers/TestConsoleProvider';

describe('mock event service', () => {

    /**
   * Register the test event provider
   */
    beforeAll(async () => {
        await Kernel.boot({
            environment: 'testing',
            providers: [
                new TestConsoleProvider(),
                new TestEventProvider()
            ],
            commands: []
        }, {})
    })

    /**
   * Dispatch a synchronus event
   */
    test('test dispatch event sync', () => {
        App.container('events').dispatch(new TestSubscriber({ hello: 'world' }));
        expect(true).toBeTruthy()
    })
}); 