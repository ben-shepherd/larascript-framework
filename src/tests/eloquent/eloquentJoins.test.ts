/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import { queryBuilder } from '@src/core/domains/eloquent/services/EloquentQueryBuilderService';
import TestDepartmentModel, { resetTableDepartmentModel } from '@src/tests/eloquent/models/TestDepartmentModel';
import TestEmployeeModel, { resetTableEmployeeModel } from '@src/tests/eloquent/models/TestEmployeeModel';
import testHelper, { forEveryConnection } from '@src/tests/testHelper';


describe('eloquent', () => {
    const getEmployeeQuery = (connection: string) => {
        return queryBuilder(TestEmployeeModel, connection).orderBy('name', 'asc');
    }

    const getDepartmentQuery = (connection: string) => {
        return queryBuilder(TestDepartmentModel, connection).orderBy('deptName', 'asc');
    }

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



    beforeAll(async () => {
        await testHelper.testBootApp()
        await resetAndRepopulate()
    });

    test('test insert department and employee relations', async () => {

        await forEveryConnection(async connection => {
            const employeeQuery = getEmployeeQuery(connection)
            const departmentQuery = getDepartmentQuery(connection)

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
    })

    test('test relational model property', async () => {

        await forEveryConnection(async connection => {
            const employeeQuery = getEmployeeQuery(connection)
            const departmentQuery = getDepartmentQuery(connection)

            const aliceModel = await employeeQuery.clone()
                .where('name', 'Alice')
                .firstOrFail();

            const department = await aliceModel.attr('department');

            const hr = await departmentQuery.clone().where('deptName', 'HR').firstOrFail();

            expect(department).toBeTruthy();
            expect(department?.id).toBe(hr?.id);
        })
    })

    test('test with', async () => {
        await forEveryConnection(async connection => {
            const employeeQuery = getEmployeeQuery(connection)

            const alice = await employeeQuery.clone()
                .with('department')
                .where('name', 'Alice')
                .firstOrFail();

            expect((alice.attrSync('department') as TestDepartmentModel)).toBeTruthy();
            expect(alice?.attrSync('department')?.deptName).toBe('HR');

            const bob = await employeeQuery.clone()
                .with('department')
                .where('name', 'Bob')
                .firstOrFail();

            expect(bob?.attrSync('department')).toBeTruthy();
            expect(bob?.attrSync('department')?.deptName).toBe('Sales');

        })
    })

    test('test inner join', async () => {
        await forEveryConnection(async connection => {
            const employeeQuery = getEmployeeQuery(connection)
            const departmentTable = TestDepartmentModel.getTable();

            const alice = await employeeQuery.clone()
                .join(departmentTable, 'deptId', 'id')
                .setModelColumns(TestDepartmentModel, { columnPrefix: 'department_', 'targetProperty': 'department' })
                .where('name', 'Alice')
                .firstOrFail();

            expect(alice?.attrSync('department')).toBeTruthy();
            expect(alice?.attrSync('department')?.deptName).toBe('HR')
        
            const notFoundRelation = await employeeQuery.clone()
                .join(departmentTable, 'deptId', 'id')
                .setModelColumns(TestDepartmentModel, { columnPrefix: 'department_', 'targetProperty': 'department' })
                .where('name', 'NoRelationship')
                .first();

            expect(notFoundRelation).toBe(null)
        })

    })

    test('test left join', async () => {

        await forEveryConnection(async connection => {
            const employeeQuery = getEmployeeQuery(connection)
            const departmentTable = TestDepartmentModel.getTable();

            const alice = await employeeQuery.clone()
                .leftJoin(departmentTable, 'deptId', 'id')
                .setModelColumns(TestDepartmentModel, { columnPrefix: 'department_', 'targetProperty': 'department' })
                .where('name', 'Alice').firstOrFail();

            expect(alice?.attrSync('department')).toBeTruthy();
            expect(alice?.attrSync('department')?.deptName).toBe('HR');

            const notFoundRelation = await employeeQuery.clone()
                .leftJoin(departmentTable, 'deptId', 'id')
                .setModelColumns(TestDepartmentModel, { columnPrefix: 'department_', 'targetProperty': 'department' })
                .where('name', 'NoRelationship')
                .firstOrFail();

            expect(notFoundRelation).toBeTruthy();
            expect(notFoundRelation?.department).toBe(null);

        })

    })

    test('test right join', async () => {

        await forEveryConnection(async connection => {
            const employeeQuery = getEmployeeQuery(connection)
            const departmentTable = TestDepartmentModel.getTable();

            const alice = await employeeQuery.clone()
                .rightJoin(departmentTable, 'deptId', 'id')
                .setModelColumns(TestDepartmentModel, { columnPrefix: 'department_', 'targetProperty': 'department' })
                .where('name', 'Alice').firstOrFail();
        
            expect(alice?.attrSync('department')).toBeTruthy();
            expect(alice?.attrSync('department')?.deptName).toBe('HR');

            const notFoundRelation = await employeeQuery.clone()
                .rightJoin(departmentTable, 'deptId', 'id')
                .setModelColumns(TestDepartmentModel, { columnPrefix: 'department_', 'targetProperty': 'department' })
                .where('name', 'NoRelationship')
                .first();

            expect(notFoundRelation).toBeNull();
        })

    })

    test('test full join', async () => {

        await forEveryConnection(async connection => {
            const employeeQuery = getEmployeeQuery(connection)
            const departmentTable = TestDepartmentModel.getTable();

            // Should find matched records
            const alice = await employeeQuery.clone()
                .fullJoin(departmentTable, 'deptId', 'id')
                .setModelColumns(TestDepartmentModel, { columnPrefix: 'department_', 'targetProperty': 'department' })
                .where('name', 'Alice')
                .firstOrFail();
    
            expect(alice?.attrSync('department')).toBeTruthy();
            expect(alice?.attrSync('department')?.deptName).toBe('HR');

            // Should find unmatched employee (NoRelationship)
            const notFoundRelation = await employeeQuery.clone()
                .fullJoin(departmentTable, 'deptId', 'id')
                .setModelColumns(TestDepartmentModel, { columnPrefix: 'department_', 'targetProperty': 'department' })
                .where('name', 'NoRelationship')
                .firstOrFail();

            expect(notFoundRelation).toBeTruthy();
            expect(notFoundRelation?.department).toBeNull();

        })

    })

    test('test cross join', async () => {

        await forEveryConnection(async connection => {
            const employeeQuery = getEmployeeQuery(connection)
            const departmentTable = TestDepartmentModel.getTable();

            const results = await employeeQuery.clone()
                .crossJoin(departmentTable)
                .setModelColumns(TestDepartmentModel, { columnPrefix: 'department_', 'targetProperty': 'department' })
                .all();
    

            // With 5 employees and 4 departments, should get 20 rows
            expect(results.count()).toBe(20);

        })

    })
});