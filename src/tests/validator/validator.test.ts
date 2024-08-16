import { describe } from '@jest/globals';
import testAppConfig from '@src/config/test';
import Kernel from '@src/core/Kernel';
import testValidatorHelper from './testValidatorHelper';

describe('test validation', () => {

  beforeAll(async () => {
    await Kernel.boot(testAppConfig, {})
  }, 10000)

  const validator = new testValidatorHelper.UserValidator();
  const { UserObjectGood, UserObjectBad } = testValidatorHelper

  test('test successful validation', async () => {
    const result = validator.validate(UserObjectGood)

    expect(result.success).toBeTruthy();
    expect(result.joi.error).toBeFalsy();
  })

  test('test failed validation', async () => {
    const result = validator.validate(UserObjectBad)

    expect(result.success).toBeFalsy();
    expect(result.joi.error).toBeTruthy();

    console.log('failed validation', result.joi.error)
  })
});