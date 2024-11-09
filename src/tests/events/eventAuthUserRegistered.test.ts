/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import { IUserData } from '@src/app/models/auth/User';
import { App } from '@src/core/services/App';
import { TestUserCreatedListener } from '@src/tests/events/events/auth/TestUserCreatedListener';
import TestUserCreatedSubscriber from '@src/tests/events/events/auth/TestUserCreatedSubscriber';
import { dropWorkerTables } from '@src/tests/events/helpers/createWorketTables';
import TestUserFactory from '@src/tests/factory/TestUserFactory';

import testHelper from '../testHelper';


describe('mock queable event', () => {

    /**
   * Register the test event provider
   */
    beforeAll(async () => {
        await testHelper.testBootApp()
    })

    afterAll(async () => {
        await dropWorkerTables();
    })


    /**
     * - Dispatch TestEventQueueEvent, this will add a queued item to the database
     * - Run the worker, which will dispatch TestEventQueueCalledFromWorkerEvent
     * - Check the events have been dispatched
     * - Check the worker empty has been cleared
     */
    test('test queued worker ', async () => {

        const eventService = App.container('events');
        
        eventService.mockEvent(TestUserCreatedListener)
        eventService.mockEvent(TestUserCreatedSubscriber)

        const testUser = new TestUserFactory().createWithData({
            email: 'test@example.com',
            hashedPassword: 'password',
            roles: [],
            groups: [],
            firstName: 'Tony',
            lastName: 'Stark'
        })
        
        await testUser.save();
        expect(testUser.getId()).toBeTruthy();

        const expectedPayloadCallback = (payload: IUserData) => {
            return payload.id === testUser.getId() && payload.email === 'test@example.com'
        }

        expect(
            eventService.assertDispatched<IUserData>(TestUserCreatedListener, expectedPayloadCallback)
        ).toBeTruthy()

        expect(
            eventService.assertDispatched<IUserData>(TestUserCreatedSubscriber, expectedPayloadCallback)
        ).toBeTruthy()
    })


}); 