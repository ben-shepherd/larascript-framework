import ApiToken from '@app/models/auth/ApiToken';
import User from '@app/models/auth/User';
import { describe } from '@jest/globals';
import authConfig from '@src/config/auth/auth';
import testAppConfig from '@src/config/test';
import UserFactory from '@src/core/domains/auth/factory/UserFactory';
import AuthProvider from '@src/core/domains/auth/providers/AuthProvider';
import hashPassword from '@src/core/domains/auth/utils/hashPassword';
import MongoDBProvider from '@src/core/domains/database/mongodb/providers/MongoDBProvider';
import Kernel from '@src/core/Kernel';
import { App } from '@src/core/services/App';

describe('attempt to run app with normal appConfig', () => {

    let testUser: User;
    const email = 'testUser@test.com';
    const password = 'testPassword';
    const hashedPassword = hashPassword(password);
    let jwtToken: string;
    let apiToken: ApiToken | null; 

    beforeAll(async () => {
        await Kernel.boot({
            ...testAppConfig,
            providers: [
                new MongoDBProvider(),
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

    test('test create user validator', async () => {
        const validator = new authConfig.validators.createUser()
        const result = validator.validate({
            email,
            password
        });
        expect(result.success).toBeTruthy();
    })

    test('test update user validator', async () => {
        const validator = new authConfig.validators.updateUser()
        const result = validator.validate({
            password,
            firstName: 'Tony',
            lastName: 'Stark'
        });
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