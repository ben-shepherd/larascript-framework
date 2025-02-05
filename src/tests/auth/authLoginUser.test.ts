/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import authConfig from '@src/config/auth';
import IApiTokenModel from '@src/core/domains/auth-legacy/interfaces/IApitokenModel';
import IUserModel from '@src/core/domains/auth-legacy/interfaces/IUserModel';
import { auth } from '@src/core/domains/auth-legacy/services/JwtAuthService';
import hashPassword from '@src/core/domains/auth-legacy/utils/hashPassword';
import { logger } from '@src/core/domains/logger/services/LoggerService';
import TestUserFactory from '@src/tests/factory/TestUserFactory';
import TestApiTokenModel from '@src/tests/models/models/TestApiTokenModel';
import TestUser from '@src/tests/models/models/TestUser';
import testHelper from '@src/tests/testHelper';


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
        testUser = new TestUserFactory().create({
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
        const validator = new authConfig.validators.createUser()
        const result = await validator.validate({
            email,
            password,
            firstName: 'Tony',
            lastName: 'Stark'
        });

        expect(result.success).toBeFalsy();
    })

    test('test create user validator', async () => {
        const validator = new authConfig.validators.createUser()
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
        const validator = new authConfig.validators.updateUser()
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
        jwtToken = await auth().attemptCredentials(email, password);
        logger().info('[jwtToken]', jwtToken);
        expect(jwtToken).toBeTruthy();
    })

    test('create api token from user', async () => {
        apiToken = await auth().createApiTokenFromUser(testUser);
        logger().info('[apiToken]', apiToken);
        expect(apiToken).toBeInstanceOf(TestApiTokenModel);
    })

    test('create jwt from user', async () => {
        const jwt = await auth().createJwtFromUser(testUser);
        logger().info('[jwt]', jwt);
        expect(jwt).toBeTruthy();
    })

    test('verify token', async () => {
        apiToken = await auth().attemptAuthenticateToken(jwtToken);
        expect(apiToken).toBeInstanceOf(TestApiTokenModel);

        const user = await apiToken?.getAttribute('user');
        expect(user).toBeInstanceOf(TestUser);
    })

    test('revoke token', async () => {
        expect(apiToken).toBeInstanceOf(TestApiTokenModel);

        apiToken && await auth().revokeToken(apiToken);

        await apiToken?.refresh();
        expect(apiToken?.revokedAt).toBeTruthy();
    })

})