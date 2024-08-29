import { describe, expect, test } from '@jest/globals';
import appConfig from '@src/config/app';
import AuthService from '@src/core/domains/auth/services/AuthService';
import ConsoleService from '@src/core/domains/console/service/ConsoleService';
import DatabaseService from '@src/core/domains/database/services/DatabaseService';
import EventService from '@src/core/domains/events/services/EventService';
import Express from '@src/core/domains/express/services/Express';
import Kernel from '@src/core/Kernel';
import { App } from '@src/core/services/App';

describe('attempt to run app with normal appConfig', () => {

  /**
   * Boot kernel normally
   * Check containers have been set
   */
  test.concurrent('kernel boot', async () => {
    await Kernel.boot(appConfig, {})
    expect(App.container('events')).toBeInstanceOf(EventService);
    expect(App.container('db')).toBeInstanceOf(DatabaseService);
    expect(App.container('express')).toBeInstanceOf(Express);
    expect(App.container('console')).toBeInstanceOf(ConsoleService);
    expect(App.container('auth')).toBeInstanceOf(AuthService);
    expect(Kernel.getInstance().booted()).toBe(true);
  }, 10000)
});