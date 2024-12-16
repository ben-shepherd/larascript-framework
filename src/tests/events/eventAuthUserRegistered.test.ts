/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import { IUserData } from '@src/app/models/auth/User';
import { events } from '@src/core/domains/events/services/EventService';
import { TestUserCreatedListener } from '@src/tests/events/events/auth/TestUserCreatedListener';
import TestUserCreatedSubscriber from '@src/tests/events/events/auth/TestUserCreatedSubscriber';
import resetWorkerTables from '@src/tests/events/helpers/createWorketTables';
import TestUserFactory from '@src/tests/factory/TestUserFactory';
import testHelper from '@src/tests/testHelper';


describe('mock queable event', () => {

    /**
   * Register the test event provider
   */
    beforeAll(async () => {
        await testHelper.testBootApp()

        try {
            await testHelper.dropAuthTables();
        }
        // eslint-disable-next-line no-unused-vars
        catch (err) {}
        
        await testHelper.createAuthTables();
    })


    /**
     * - Dispatch TestEventQueueEvent, this will add a queued item to the database
     * - Run the worker, which will dispatch TestEventQueueCalledFromWorkerEvent
     * - Check the events have been dispatched
     * - Check the worker empty has been cleared
     */
    test('test queued worker ', async () => {

        await resetWorkerTables()

        events().mockEvent(TestUserCreatedListener)
        events().mockEvent(TestUserCreatedSubscriber)

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
            events().assertDispatched<IUserData>(TestUserCreatedListener, expectedPayloadCallback)
        ).toBeTruthy()

        expect(
            events().assertDispatched<IUserData>(TestUserCreatedSubscriber, expectedPayloadCallback)
        ).toBeTruthy()
    })


}); 