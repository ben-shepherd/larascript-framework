import { describe, expect, test } from '@jest/globals';
import AuthService from '@src/core/domains/auth/services/AuthService';
import JwtAuthService from '@src/core/domains/auth/services/JwtAuthService';
import ConsoleService from '@src/core/domains/console/service/ConsoleService';
import Database from '@src/core/domains/database/services/Database';
import EventService from '@src/core/domains/events/services/EventService';
import Kernel from '@src/core/Kernel';
import { App } from '@src/core/services/App';
import testHelper from '@src/tests/testHelper';

describe('attempt to run app with normal appConfig', () => {

    /**
   * Boot kernel normally
   * Check containers have been set
   */
    test.concurrent('kernel boot', async () => {
        await testHelper.testBootApp()
        expect(App.container('events')).toBeInstanceOf(EventService);
        expect(App.container('db')).toBeInstanceOf(Database);
        expect(App.container('console')).toBeInstanceOf(ConsoleService);
        expect(App.container('auth')).toBeInstanceOf(AuthService);
        expect(App.container('auth.jwt')).toBeInstanceOf(JwtAuthService);
        expect(Kernel.getInstance().booted()).toBe(true);
    }, 10000)
});