/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import ApiToken from '@src/app/models/auth/ApiToken';
import User from '@src/app/models/auth/User';
import authConfig from '@src/config/auth';
import UserFactory from '@src/core/domains/auth/factory/userFactory';
import IApiTokenModel from '@src/core/domains/auth/interfaces/IApitokenModel';
import AuthProvider from '@src/core/domains/auth/providers/AuthProvider';
import hashPassword from '@src/core/domains/auth/utils/hashPassword';
import DatabaseProvider from '@src/core/domains/database/providers/DatabaseProvider';
import Kernel from '@src/core/Kernel';
import { App } from '@src/core/services/App';
import testAppConfig from '@src/tests/config/testConfig';
import TestConsoleProvider from '@src/tests/providers/TestConsoleProvider';

describe('attempt to run app with normal appConfig', () => {

    let testUser: User;
    const email = 'testUser@test.com';
    const password = 'testPassword';
    const hashedPassword = hashPassword(password);
    let jwtToken: string;
    let apiToken: IApiTokenModel | null; 

    beforeAll(async () => {
        await Kernel.boot({
            ...testAppConfig,
            providers: [
                new TestConsoleProvider(),
                new DatabaseProvider(),
                new AuthProvider()
            ]
        }, {});

        /**
         * Create a test user
         */
        testUser = new UserFactory().create({
            email,
            hashedPassword,
            roles: [],
            groups: [],
            firstName: 'Tony',
            lastName: 'Stark'
        })
        await testUser.save();
        expect(testUser.getId()).toBeTruthy();
        expect(testUser.getAttribute('firstName')).toBe('Tony');
    })

    afterAll(async () => {
        await testUser?.delete();
        expect(testUser?.getData({ excludeGuarded: false })).toBeNull();

        await apiToken?.delete();
        expect(apiToken?.getData({ excludeGuarded: false })).toBeNull();  
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
            console.error(result.joi.error);
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
            console.error(result.joi.error);
        }

        expect(result.success).toBeTruthy();
    })

    test('attempt credentials', async () => {
        jwtToken = await App.container('auth').attemptCredentials(email, password);
        expect(jwtToken).toBeTruthy();
    })

    test('create api token from user', async () => {
        apiToken = await App.container('auth').createApiTokenFromUser(testUser);
        expect(apiToken).toBeInstanceOf(ApiToken);
    })

    test('create jwt from user', async () => {
        const jwt = await App.container('auth').createJwtFromUser(testUser);
        expect(jwt).toBeTruthy();
    })

    test('verify token', async () => {
        apiToken = await App.container('auth').attemptAuthenticateToken(jwtToken);
        expect(apiToken).toBeInstanceOf(ApiToken);

        const user = await apiToken?.user();
        expect(user).toBeInstanceOf(User);
    })

    test('revoke token', async () => {
        expect(apiToken).toBeInstanceOf(ApiToken);
        apiToken && await App.container('auth').revokeToken(apiToken);

        await apiToken?.refresh();
        expect(apiToken?.data?.revokedAt).toBeTruthy();
    })

})