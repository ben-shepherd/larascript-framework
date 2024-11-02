/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import Kernel from '@src/core/Kernel';
import { App } from '@src/core/services/App';
import testAppConfig from '@src/tests/config/testConfig';
import TestEventSyncEvent from '@src/tests/events/events/TestEventSyncEvent';
import TestConsoleProvider from '@src/tests/providers/TestConsoleProvider';
import TestEventProvider from '@src/tests/providers/TestEventProvider';

describe('mock event service', () => {

    /**
   * Register the test event provider
   */
    beforeAll(async () => {
        await Kernel.boot({
            ...testAppConfig,
            providers: [
                ...testAppConfig.providers,
                new TestConsoleProvider(),
                new TestEventProvider()
            ]
        }, {})
    })

    /**
   * Dispatch a synchronus event
   */
    test('test dispatch event sync', () => {
        
        App.container('events').dispatch(new TestEventSyncEvent({ hello: 'world' }));
        
        // todo: check something has changed.
    })
}); 