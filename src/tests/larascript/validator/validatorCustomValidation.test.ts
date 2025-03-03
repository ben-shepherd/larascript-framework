import { beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import { db } from '@src/core/domains/database/services/Database';
import { DataTypes } from 'sequelize';

import testHelper from '../../testHelper';
import TestCustomValidator from './validators/TestCreateUserCustomValidator';

describe('Custom Validator Tests', () => {
    let validator: TestCustomValidator;

    beforeAll(async () => {
        await testHelper.testBootApp()

        const schema = db().schema()
        await schema.dropTable('users')
        await schema.createTable('users', {
            id: DataTypes.INTEGER,
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            firstName: DataTypes.STRING,
            lastName: DataTypes.STRING,
            password: DataTypes.STRING,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        })
    })

    beforeEach(() => {
        validator = new TestCustomValidator();
    });


    it('should pass validation with valid data', async () => {
        const data = {
            email: 'john@example.com',
            password: 'password123',
            firstName: 'John',
            lastName: 'Doe'
        };

        const result = await validator.validate(data);
        expect(result.passes()).toBe(true);
        expect(result.errors()).toEqual({});
    });

    it('should fail custom validation when firstName is not John', async () => {
        const data = {
            email: 'jane@example.com',
            password: 'password123',
            firstName: 'Jane', // Not John
            lastName: 'Doe'
        };

        const result = await validator.validate(data);
        expect(result.fails()).toBe(true);
        expect(result.errors()?.['firstName.custom']).toEqual(['The first name should be John'])
    });

    it('should fail validation with missing required fields', async () => {
        const data = {
            email: 'john@example.com',
            firstName: 'John'
            // Missing password and lastName
        };

        const result = await validator.validate(data);
        expect(result.fails()).toBe(true);
        expect(result.errors()).toHaveProperty('password');
        expect(result.errors()).toHaveProperty('lastName');
    });

    it('should fail validation with missing required fields, custom validation failed', async () => {
        const data = {
            email: 'john@example.com',
            firstName: 'Jane'
            // Missing password and lastName
        };

        const result = await validator.validate(data);
        expect(result.fails()).toBe(true);
        expect(result.errors()?.['firstName.custom']).toEqual(['The first name should be John'])
        expect(result.errors()?.['password']?.includes('The password field is required.')).toBe(true)
        expect(result.errors()?.['lastName']?.includes('The lastName field is required.')).toBe(true)
    });
    
    it('should fail validation with missing required fields, custom validation failed, errors are reset after next run', async () => {
        const data = {
            email: 'john@example.com',
            firstName: 'Jane'
            // Missing password and lastName
        };

        const result = await validator.validate(data);
        expect(result.fails()).toBe(true);
        expect(result.errors()?.['firstName.custom']).toEqual(['The first name should be John'])
        expect(result.errors()?.['password']?.includes('The password field is required.')).toBe(true)
        expect(result.errors()?.['lastName']?.includes('The lastName field is required.')).toBe(true)

        const data2 = {
            email: 'john@example.com',
            firstName: 'John',
            lastName: 'Doe'
        };

        const result2 = await validator.validate(data2);
        expect(result2.fails()).toBe(true);
        expect(result2.errors()?.['password']?.includes('The password field is required.')).toBe(true)
    })

}); 