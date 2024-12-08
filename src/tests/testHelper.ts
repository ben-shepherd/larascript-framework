import { EnvironmentTesting } from "@src/core/consts/Environment";
import EloquentQueryProvider from "@src/core/domains/eloquent/providers/EloquentQueryProvider";
import LoggerProvider from "@src/core/domains/logger/providers/LoggerProvider";
import ValidatorProvider from "@src/core/domains/validator/providers/ValidatorProvider";
import Kernel from "@src/core/Kernel";
import { App } from "@src/core/services/App";
import TestApiTokenModel from "@src/tests/models/models/TestApiTokenModel";
import TestUser from "@src/tests/models/models/TestUser";
import TestAuthProvider from "@src/tests/providers/TestAuthProvider";
import TestConsoleProvider from "@src/tests/providers/TestConsoleProvider";
import TestDatabaseProvider, { testDbName } from "@src/tests/providers/TestDatabaseProvider";
import TestEventProvider from "@src/tests/providers/TestEventProvider";
import TestMigrationProvider from "@src/tests/providers/TestMigrationProvider";
import { DataTypes } from "sequelize";

export const getTestDbName = () => testDbName

/**
 * Boot the kernel in a test environment
 * @remarks
 * This function boots the kernel with the providers required for tests
 * @example
 * const testBootApp = await testBootApp()
 * expect(App.container('db')).toBeInstanceOf(TestDatabaseProvider)
 */
const testBootApp = async () => {
    await Kernel.boot({
        environment: EnvironmentTesting,
        providers: [
            new LoggerProvider(),
            new TestConsoleProvider(),
            new TestDatabaseProvider(),
            new EloquentQueryProvider(),
            new TestEventProvider(),
            new TestAuthProvider(),
            new TestMigrationProvider(),
            new ValidatorProvider()
        ]
    }, {});
}


/**
 * Creates the auth tables in the database
 * @remarks
 * This function creates the `users` and `api_tokens` tables in the database
 * @param connectionName The name of the database connection to use
 */
export const createAuthTables = async(connectionName?: string) => {
    const schema = App.container('db').schema(connectionName)

    const userTable = (new TestUser).table;
    const apiTokenTable = (new TestApiTokenModel).table;

    const stringNullable = {
        type: DataTypes.STRING,
        allowNull: true
    }

    await schema.createTable(userTable, {
        email: DataTypes.STRING,
        hashedPassword: DataTypes.STRING,
        groups: DataTypes.JSON,
        roles: DataTypes.JSON,
        firstName: stringNullable,
        lastName: stringNullable,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    })

    await schema.createTable(apiTokenTable, {
        userId: DataTypes.STRING,
        token: DataTypes.STRING,
        scopes: DataTypes.JSON,
        revokedAt: DataTypes.DATE
    })
}

/**
 * Drops the `users` and `api_tokens` tables in the database
 * @remarks
 * This function removes the `users` and `api_tokens` tables from the database
 * @param connectionName The name of the database connection to use
 */
export const dropAuthTables = async(connectionName?: string) => {
    const schema = App.container('db').schema(connectionName)

    const userTable = (new TestUser).table;
    const apiTokenTable = (new TestApiTokenModel).table;

    await schema.dropTable(userTable);
    await schema.dropTable(apiTokenTable);
}

/**
     * Run fresh migrations with the testing group and seed the database
     * @remarks
     * This function is used to run fresh migrations with the testing group and seed the database
     * @example
     * await runFreshMigrations()
     */
const runFreshMigrations = async () => {
    await App.container('console').reader(['migrate:fresh', '--group=testing', '--seed']).handle();
}

/**
 * Revert all migrations with the testing group
 * @remarks
 * This function is used to clear all migrations with the testing group. It is used
 * to reset the database to its original state after running tests.
 * @example
 * await clearMigrations()
 */
const clearMigrations = async () => {
    await App.container('console').reader(['migrate:down', '--group=testing']).handle();
}

/**
 * Retrieves a list of test database connection names, excluding any specified.
 * @param exclude An array of connection names to exclude from the result.
 * @returns An array of connection names, excluding those specified in the `exclude` parameter.
 */
export const getTestConnectionNames = ({ exclude = [] }: { exclude?: string[] } = {}) => {
    // return ['mongodb', 'postgres'].filter(connectionName => !exclude.includes(connectionName));
    return ['postgres']
}

const testHelper = {
    testBootApp,
    runFreshMigrations,
    clearMigrations,
    getTestDbName,
    getTestConnectionNames,
    createAuthTables,
    dropAuthTables
} as const

export default testHelper