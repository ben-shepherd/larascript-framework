/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import { IApiTokenModel } from '@src/core/domains/auth/interfaces/models/IApiTokenModel';
import { IUserModel } from '@src/core/domains/auth/interfaces/models/IUserModel';
import { auth } from '@src/core/domains/auth/services/AuthService';
import hashPassword from '@src/core/domains/auth/utils/hashPassword';
import { logger } from '@src/core/domains/logger/services/LoggerService';
import TestApiTokenModel from '@src/tests/models/models/TestApiTokenModel';
import TestUser from '@src/tests/models/models/TestUser';
import testHelper from '@src/tests/testHelper';
import TestCreateUserValidator from '@src/tests/validator-legacy/TestCreateUserValidator';
import TestUpdateUserValidator from '@src/tests/validator-legacy/TestUpdateUserValidator';


describe('attempt to run app with normal appConfig', () => {

    let testUser: IUserModel;
    const email = 'testUser@test.com';
    const password = 'testPassword';
    const hashedPassword = hashPassword(password);
    let jwtToken: string;
    let apiToken: IApiTokenModel | null; 

    beforeAll(async () => {
        await testHelper.testBootApp();

        try {
            await testHelper.dropAuthTables();
        }
        // eslint-disable-next-line no-unused-vars
        catch (err) {}
        
        await testHelper.createAuthTables();

        /**
         * Create a test user
         */
        testUser = TestUser.create({
            email,
            hashedPassword,
            roles: [],
            groups: [],
            firstName: 'Tony',
            lastName: 'Stark'
        })
        await testUser.save();
        expect(testUser.getId()).toBeTruthy();
        expect(testUser.getAttributeSync('firstName')).toBe('Tony');
    })

    afterAll(async () => {
        await testUser?.delete();
        expect(await testUser?.getAttributes({ excludeGuarded: false })).toBeNull();

        await apiToken?.delete();
        expect(await apiToken?.getAttributes({ excludeGuarded: false })).toBeNull();  
    })

    test('test create user validator (email already exists, validator should fail)', async () => {
        const validator = new TestCreateUserValidator()
        const result = await validator.validate({
            email,
            password,
            firstName: 'Tony',
            lastName: 'Stark'
        });

        expect(result.success).toBeFalsy();
    })

    test('test create user validator', async () => {
        const validator = new TestCreateUserValidator()
        const result = await validator.validate({
            email: 'testUser2@test.com',
            password,
            firstName: 'Tony',
            lastName: 'Stark'

        });

        if(!result.success) {
            logger().error(result.joi.error);
        }

        expect(result.success).toBeTruthy();
    })


    test('test update user validator', async () => {
        const validator = new TestUpdateUserValidator()
        const result = await validator.validate({
            password,

            firstName: 'Tony',
            lastName: 'Stark'
        });

        if(!result.success) {
            logger().error(result.joi.error);
        }

        expect(result.success).toBeTruthy();
    })

    test('attempt credentials', async () => {
        jwtToken = await auth().getJwtAdapter().attemptCredentials(email, password);
        logger().info('[jwtToken]', jwtToken);
        expect(jwtToken).toBeTruthy();
    })


    test('create jwt from user', async () => {
        const jwt = await auth().getJwtAdapter().createJwtFromUser(testUser);
        logger().info('[jwt]', jwt);
        expect(jwt).toBeTruthy();
    })

    test('verify token', async () => {
        apiToken = await auth().getJwtAdapter().attemptAuthenticateToken(jwtToken);
        expect(apiToken).toBeInstanceOf(TestApiTokenModel);

        const user = await apiToken?.getAttribute('user');
        expect(user).toBeInstanceOf(TestUser);
    })

    test('revoke token', async () => {
        expect(apiToken).toBeInstanceOf(TestApiTokenModel);

        apiToken && await auth().getJwtAdapter().revokeToken(apiToken);

        await apiToken?.refresh();
        expect(apiToken?.revokedAt).toBeTruthy();
    })

})