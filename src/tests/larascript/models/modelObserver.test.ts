/* eslint-disable no-undef */
import { describe, expect, test } from '@jest/globals';
import { logger } from '@src/core/domains/logger/services/LoggerService';
import TestObserverModel, { resetTestObserverTable } from '@src/tests/larascript/models/models/TestObserverModel';
import testHelper from '@src/tests/testHelper';

const connections = testHelper.getTestConnectionNames()



describe('test model observer', () => {

    beforeAll(async () => {
        await testHelper.testBootApp()
    })

    test('observer', async () => {
        
        for(const connectionName of connections) {
            logger().console('[Connection]', connectionName)

            await resetTestObserverTable();

            const startingNameValue = 'John';
            const expectedNameValue = 'Bob';

            const startingNumberValue = 0;
            const expectedNumberValue = 1;
        
            /**
             * Create a model
             * 
             * The 'TestModelObserver' will modify the following attributes:
             * - On creating, it will set  'number' to 1
             * = On setting the name, it will set the name to 'Bob'
             */ 
            const createdModel = new TestObserverModel({
                name: startingNameValue,
                number: startingNumberValue
            });
            await createdModel.save();

            // Name should not have been modified
            expect(createdModel.getAttributeSync('name')).toEqual(startingNameValue);
            // Only the 'number' attribute should have been modified
            expect(createdModel.getAttributeSync('number')).toEqual(expectedNumberValue);

            // On setting the name, it will set the name to 'Bob'
            await createdModel.setAttribute('name', 'new name');
            expect(createdModel.getAttributeSync('name')).toEqual(expectedNameValue);


        }

    
    })
});
