import { describe, expect, test } from '@jest/globals';
import appConfig from '@src/config/app';
import BaseAuthService from '@src/core/domains/auth/services/BaseAuthService';
import ConsoleService from '@src/core/domains/console/service/ConsoleService';
import MongoDB from '@src/core/domains/database/mongodb/services/MongoDB';
import EventService from '@src/core/domains/events/services/EventService';
import Kernel from '@src/core/Kernel';
import { App } from '@src/core/services/App';
import Express from '@src/core/services/Express';

describe('attempt to run app with normal appConfig', () => {

  /**
   * Boot kernel normally
   * Check containers have been set
   */
  test.concurrent('kernel boot', async () => {
    await Kernel.boot(appConfig, {})
    expect(App.container('events')).toBeInstanceOf(EventService);
    expect(App.container('mongodb')).toBeInstanceOf(MongoDB);
    expect(App.container('express')).toBeInstanceOf(Express);
    expect(App.container('console')).toBeInstanceOf(ConsoleService);
    expect(App.container('auth')).toBeInstanceOf(BaseAuthService);
    expect(Kernel.getInstance().booted()).toBe(true);
  }, 10000)
});