/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import { queryBuilder } from '@src/core/domains/eloquent/services/EloquentQueryBuilderService';
import TestDepartmentModel, { resetTableDepartmentModel } from '@src/tests/larascript/eloquent/models/TestDepartmentModel';
import TestEmployeeModel, { resetTableEmployeeModel } from '@src/tests/larascript/eloquent/models/TestEmployeeModel';
import testHelper, { forEveryConnection } from '@src/tests/testHelper';

const resetAndRepopulate = async () => {
    await resetTableEmployeeModel();
    await resetTableDepartmentModel();

    await forEveryConnection(async connection => {
        const insertedDepartments = await queryBuilder(TestDepartmentModel, connection).insert([
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

        await queryBuilder(TestEmployeeModel, connection).insert([
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
    })
}

describe('eloquent', () => {

    beforeAll(async () => {
        await testHelper.testBootApp()
    });

    test('employee result is a model and passes', async () => {
        await resetAndRepopulate();

        await forEveryConnection(async connection => {

            const alice = await TestEmployeeModel.query()
                .where('name', 'Alice')
                .with('department')
                .firstOrFail() as TestEmployeeModel;

            const expectedHrDepartment = await TestDepartmentModel.query().where('deptName', 'HR').firstOrFail() as TestDepartmentModel
            const department = alice.attrSync('department')

            expect(department).toBeInstanceOf(TestDepartmentModel)
            expect(department?.id).toEqual(expectedHrDepartment.id)
        })
    })

    test('department has many employees as models, should pass', async () => {
        await resetAndRepopulate();

        await forEveryConnection(async connection => {

            const finance = await TestDepartmentModel.query()
                .where('deptName', 'Finance')
                .with('employees')
                .firstOrFail() as TestDepartmentModel
            const employees = finance.attrSync('employees')

            expect(typeof employees === 'object').toBeTruthy()
            expect(Array.isArray(employees)).toBeTruthy()
            expect(Array.isArray(employees) && employees.length === 2).toBeTruthy()

            const firstEmployee = employees?.[0]
            expect(firstEmployee).toBeInstanceOf(TestEmployeeModel)
            
            const secondEmployee = employees?.[0]
            expect(secondEmployee).toBeInstanceOf(TestEmployeeModel)
        })
    })
});