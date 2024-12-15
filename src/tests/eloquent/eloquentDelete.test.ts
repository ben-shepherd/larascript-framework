/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import { IEloquent } from '@src/core/domains/eloquent/interfaces/IEloquent';
import { queryBuilder } from '@src/core/domains/eloquent/services/EloquentQueryBuilderService';
import testHelper from '@src/tests/testHelper';
import TestDepartmentModel, { resetTableDepartmentModel } from '@src/tests/eloquent/models/TestDepartmentModel';
import TestEmployeeModel, { resetTableEmployeeModel } from '@src/tests/eloquent/models/TestEmployeeModel';

const dateOneYearInPast = new Date();
dateOneYearInPast.setFullYear(dateOneYearInPast.getFullYear() - 1);

const resetAndRepopulateTables = async () => {
    await resetTableDepartmentModel()
    await resetTableEmployeeModel()

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

    await employeeQuery.clone().insert([
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
            createdAt: dateOneYearInPast,
            updatedAt: new Date()
        },
        {
            deptId: null,
            name: 'NoRelationship',
            age: 40,
            salary: 50000,
            createdAt: dateOneYearInPast,
            updatedAt: new Date()
        }
    ])
}

let employeeQuery!: IEloquent<TestEmployeeModel>;

describe('eloquent', () => {

    beforeAll(async () => {
        await testHelper.testBootApp()

        employeeQuery = queryBuilder(TestEmployeeModel)
    });

    test('test delete all', async () => {
        await resetAndRepopulateTables();

        await employeeQuery.clone()
            .delete();

        const resultCount = await employeeQuery.clone().count();
        expect(resultCount).toBe(0);

    });

    test('delete one', async () => {

        await resetAndRepopulateTables();

        await employeeQuery.clone()
            .where('name', 'Alice')
            .delete();

        const resultCount = await employeeQuery.clone().count();
        expect(resultCount).toBe(4);

        const resultAlice = await employeeQuery.clone()
            .where('name', 'Alice')
            .first();
        expect(resultAlice).toBeNull();


    })

    test('delete some', async () => {

        await resetAndRepopulateTables();

        await employeeQuery.clone()
            .where('age', '>', 30)
            .delete();

        const resultCount = await employeeQuery.clone().count();
        expect(resultCount).toBe(2);
    })

    test('delete some by date', async () => {

        await resetAndRepopulateTables();

        await employeeQuery.clone()
            .where('createdAt', '>', dateOneYearInPast)
            .delete();

        const resultCount = await employeeQuery.clone().count();
        expect(resultCount).toBe(2);
    })
    
    test('delete with limit', async () => {

        await resetAndRepopulateTables();

        await employeeQuery.clone()
            .limit(2)
            .whereRaw(`id IN (SELECT id FROM tests_employees LIMIT 2)`)
            .delete();

        const resultCount = await employeeQuery.clone().count();
        expect(resultCount).toBe(3);
    })
});