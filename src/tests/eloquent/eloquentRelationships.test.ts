/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import { queryBuilder } from '@src/core/domains/eloquent/services/EloquentQueryBuilderService';
import TestDepartmentModel, { resetTableDepartmentModel } from '@src/tests/eloquent/models/TestDepartmentModel';
import TestEmployeeModel, { resetTableEmployeeModel } from '@src/tests/eloquent/models/TestEmployeeModel';
import testHelper from '@src/tests/testHelper';

const resetAndRepopulate = async () => {
    await resetTableEmployeeModel();
    await resetTableDepartmentModel();

    const insertedDepartments = await queryBuilder(TestDepartmentModel).insert([
        {
            deptName: 'HR',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            deptName: 'Sales',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            deptName: 'IT',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            deptName: 'Finance',
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ])

    await queryBuilder(TestEmployeeModel).insert([
        {
            deptId: insertedDepartments.find((department) => department?.deptName === 'HR')?.id,
            name: 'Alice',
            age: 25,
            salary: 10000,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            deptId: insertedDepartments.find((department) => department?.deptName === 'Sales')?.id,
            name: 'Bob',
            salary: 20000,
            age: 30,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            deptId: insertedDepartments.find((department) => department?.deptName === 'IT')?.id,
            name: 'John',
            age: 35,
            salary: 30000,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            deptId: insertedDepartments.find((department) => department?.deptName === 'Finance')?.id,
            name: 'Jane',
            age: 40,
            salary: 40000,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            deptId: insertedDepartments.find((department) => department?.deptName === 'Finance')?.id,
            name: 'Peter',
            age: 50,
            salary: 50000,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            deptId: null,
            name: 'NoRelationship',
            age: 40,
            salary: 50000,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ])
}

describe('eloquent', () => {

    beforeAll(async () => {
        await testHelper.testBootApp()
    });

    test('belongs to successful', async () => {
        await resetAndRepopulate();

        const alice = await queryBuilder(TestEmployeeModel).where('name', 'Alice').firstOrFail();
        const department = await alice.attr('department');

        expect(department).toBeTruthy();
        expect(department?.id).toBe(alice?.attrSync('department')?.id);
        expect(department?.deptName).toBe('HR');
    })

    test('belongs to no relationship', async() => {

        const noRelationship = await queryBuilder(TestEmployeeModel).where('name', 'NoRelationship').firstOrFail();
        const department = await noRelationship.attr('department');

        expect(department).toBe(null);
    })

    test('has many successful', async () => {

        const finance = await queryBuilder(TestDepartmentModel).where('deptName', 'Finance').firstOrFail();
        const employees = await finance.attr('employees');

        expect(employees).toBeTruthy();
        expect(employees?.count()).toBe(2);
        expect(employees?.find((employee) => employee?.name === 'Jane')?.name).toBe('Jane');
        expect(employees?.find((employee) => employee?.name === 'Peter')?.name).toBe('Peter');
    })


});