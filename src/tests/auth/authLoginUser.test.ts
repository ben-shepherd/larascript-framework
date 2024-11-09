/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import authConfig from '@src/config/auth';
import IApiTokenModel from '@src/core/domains/auth/interfaces/IApitokenModel';
import IUserModel from '@src/core/domains/auth/interfaces/IUserModel';
import hashPassword from '@src/core/domains/auth/utils/hashPassword';
import { App } from '@src/core/services/App';

import TestUserFactory from '../factory/TestUserFactory';
import TestApiTokenModel from '../models/models/TestApiTokenModel';
import TestUser from '../models/models/TestUser';
import testHelper from '../testHelper';


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
        testUser = new TestUserFactory().createWithData({
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
        expect(await testUser?.getData({ excludeGuarded: false })).toBeNull();

        await apiToken?.delete();
        expect(await apiToken?.getData({ excludeGuarded: false })).toBeNull();  
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
            App.container('logger').error(result.joi.error);
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
            App.container('logger').error(result.joi.error);
        }

        expect(result.success).toBeTruthy();
    })

    test('attempt credentials', async () => {
        jwtToken = await App.container('auth').attemptCredentials(email, password);
        expect(jwtToken).toBeTruthy();
    })

    test('create api token from user', async () => {
        apiToken = await App.container('auth').createApiTokenFromUser(testUser);
        expect(apiToken).toBeInstanceOf(TestApiTokenModel);
    })

    test('create jwt from user', async () => {
        const jwt = await App.container('auth').createJwtFromUser(testUser);
        expect(jwt).toBeTruthy();
    })

    test('verify token', async () => {
        apiToken = await App.container('auth').attemptAuthenticateToken(jwtToken);
        expect(apiToken).toBeInstanceOf(TestApiTokenModel);

        const user = await apiToken?.user();
        expect(user).toBeInstanceOf(TestUser);
    })

    test('revoke token', async () => {
        expect(apiToken).toBeInstanceOf(TestApiTokenModel);
        apiToken && await App.container('auth').revokeToken(apiToken);

        await apiToken?.refresh();
        expect(apiToken?.attributes?.revokedAt).toBeTruthy();
    })

})