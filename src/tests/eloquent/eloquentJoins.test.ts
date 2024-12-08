/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import { IEloquent } from '@src/core/domains/eloquent/interfaces/IEloquent';
import { app } from '@src/core/services/App';
import testHelper from '@src/tests/testHelper';

import TestDepartmentModel, { resetTableDepartmentModel } from './models/TestDepartmentModel';
import TestEmployeeModel, { resetTableEmployeeModel } from './models/TestEmployeeModel';


describe('eloquent', () => {

    let departmentQuery!: IEloquent<TestDepartmentModel>;
    let departmentTable!: string;

    let employeeQuery!: IEloquent<TestEmployeeModel>;
    let employeeTable!: string;

    beforeAll(async () => {
        await testHelper.testBootApp()

        await resetTableEmployeeModel();
        await resetTableDepartmentModel();

        employeeTable =  new TestEmployeeModel(null).useTableName();
        departmentTable = new TestDepartmentModel(null).useTableName();

        departmentQuery = app('query').builder(TestDepartmentModel)
            .orderBy('deptName', 'asc');

        employeeQuery = app('query').builder(TestEmployeeModel)
            .orderBy('name', 'asc');
    });

    test('test insert department and employee relations', async () => {

        const insertedDepartments = await departmentQuery.insert([
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
    
        await employeeQuery.insert([
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
                deptId: null,
                name: 'NoRelationship',
                age: 40,
                salary: 50000,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ])
        
        const departments = await departmentQuery.clone().all()
        expect(departments.count()).toBe(4);

        const hr = departments.find((department) => department?.deptName === 'HR') as TestDepartmentModel
        expect(hr).toBeTruthy()

        const sales = departments.find((department) => department?.deptName === 'Sales') as TestDepartmentModel
        expect(sales).toBeTruthy()

        const it = departments.find((department) => department?.deptName === 'IT') as TestDepartmentModel
        expect(it).toBeTruthy()

        const finance = departments.find((department) => department?.deptName === 'Finance') as TestDepartmentModel
        expect(finance).toBeTruthy()

        const employees = await employeeQuery.clone().all()
        expect(employees.count()).toBe(5);

        const alice = employees.find((employee) => employee?.name === 'Alice') as TestEmployeeModel
        expect(alice.id).toBeTruthy()
        expect(alice.deptId).toBe(hr.id);

        const bob = employees.find((employee) => employee?.name === 'Bob') as TestEmployeeModel
        expect(bob.id).toBeTruthy()
        expect(bob.deptId).toBe(sales.id);

        const john = employees.find((employee) => employee?.name === 'John') as TestEmployeeModel
        expect(john.id).toBeTruthy()
        expect(john.deptId).toBe(it.id);

        const jane = employees.find((employee) => employee?.name === 'Jane') as TestEmployeeModel
        expect(jane.id).toBeTruthy()
        expect(jane.deptId).toBe(finance.id);
        
    })

    test('test model property', async () => {

        const aliceModel = await employeeQuery.clone()
            .where('name', 'Alice')
            .firstOrFail();

        const department = await aliceModel.attr('department');

        const hr = await departmentQuery.clone().where('deptName', 'HR').firstOrFail();

        expect(department).toBeTruthy();
        expect(department).toBe(hr?.id);
    })

    test('test with', async () => {
        
        const alice = await employeeQuery.clone()
            .with('department')
            .where('name', 'Alice')
            .firstOrFail();

        expect(alice?.department).toBeTruthy();
        expect(alice?.department?.deptName).toBe('HR');

        const bob = await employeeQuery.clone()
            .with('department')
            .where('name', 'Bob')
            .firstOrFail();

        expect(bob?.department).toBeTruthy();
        expect(bob?.department?.deptName).toBe('Sales');

    })

    test('test inner join', async () => {
    
        const alice = await employeeQuery.clone()
            .join(departmentTable, 'deptId', 'id')
            .setModelColumns(TestDepartmentModel, { columnPrefix: 'department_', 'targetProperty': 'department' })
            .where('name', 'Alice')
            .firstOrFail();

        expect(alice?.department).toBeTruthy();
        expect(alice?.department?.deptName).toBe('HR')
        
        const notFoundRelation = await employeeQuery.clone()
            .join(departmentTable, 'deptId', 'id')
            .setModelColumns(TestDepartmentModel, { columnPrefix: 'department_', 'targetProperty': 'department' })
            .where('name', 'NoRelationship')
            .first();

        expect(notFoundRelation).toBe(null)

    })

    test('test left join', async () => {
        
        const alice = await employeeQuery.clone()
            .leftJoin(departmentTable, 'deptId', 'id')
            .setModelColumns(TestDepartmentModel, { columnPrefix: 'department_', 'targetProperty': 'department' })
            .where('name', 'Alice').firstOrFail();

        expect(alice?.department).toBeTruthy();
        expect(alice?.department?.deptName).toBe('HR');

        const notFoundRelation = await employeeQuery.clone()
            .leftJoin(departmentTable, 'deptId', 'id')
            .setModelColumns(TestDepartmentModel, { columnPrefix: 'department_', 'targetProperty': 'department' })
            .where('name', 'NoRelationship')
            .firstOrFail();

        expect(notFoundRelation).toBeTruthy();
        expect(notFoundRelation?.department).toBe(null);

    })

    test('test right join', async () => {
        
        const alice = await employeeQuery.clone()
            .rightJoin(departmentTable, 'deptId', 'id')
            .setModelColumns(TestDepartmentModel, { columnPrefix: 'department_', 'targetProperty': 'department' })
            .where('name', 'Alice').firstOrFail();
        
        expect(alice?.department).toBeTruthy();
        expect(alice?.department?.deptName).toBe('HR');

        const notFoundRelation = await employeeQuery.clone()
            .rightJoin(departmentTable, 'deptId', 'id')
            .setModelColumns(TestDepartmentModel, { columnPrefix: 'department_', 'targetProperty': 'department' })
            .where('name', 'NoRelationship')
            .first();

        expect(notFoundRelation).toBeNull();

    })

    test('test full join', async () => {
        
        // Should find matched records
        const alice = await employeeQuery.clone()
            .fullJoin(departmentTable, 'deptId', 'id')
            .setModelColumns(TestDepartmentModel, { columnPrefix: 'department_', 'targetProperty': 'department' })
            .where('name', 'Alice')
            .firstOrFail();
    
        expect(alice?.department).toBeTruthy();
        expect(alice?.department?.deptName).toBe('HR');

        // Should find unmatched employee (NoRelationship)
        const notFoundRelation = await employeeQuery.clone()
            .fullJoin(departmentTable, 'deptId', 'id')
            .setModelColumns(TestDepartmentModel, { columnPrefix: 'department_', 'targetProperty': 'department' })
            .where('name', 'NoRelationship')
            .firstOrFail();

        expect(notFoundRelation).toBeTruthy();
        expect(notFoundRelation?.department).toBeNull();

    })

    test('test cross join', async () => {
        
        const results = await employeeQuery.clone()
            .crossJoin(departmentTable)
            .setModelColumns(TestDepartmentModel, { columnPrefix: 'department_', 'targetProperty': 'department' })
            .all();
    

        // With 5 employees and 4 departments, should get 20 rows
        expect(results.count()).toBe(20);

    })
});