import { describe, expect, test } from '@jest/globals';
import testAppConfig from '@src/config/test';
import Kernel from '@src/core/Kernel';
import ExpressProvider from '@src/core/providers/ExpressProvider';
import { App } from '@src/core/services/App';
import Express from '@src/core/services/Express';

describe('expressListener module', () => {
  test('express listening for connections', async () => {
    
    await Kernel.boot({
        ...testAppConfig,
        providers: [
            new ExpressProvider()
        ]
    }, {})

    const express = App.container('express');

    expect(express).toBeInstanceOf(Express);

    expect(true).toBeTruthy();
  });
});