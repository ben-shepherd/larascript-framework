import { EnvironmentTesting } from "@src/core/consts/Environment";
import AccessControlProvider from "@src/core/domains/accessControl/providers/AccessControlProvider";
import EloquentQueryProvider from "@src/core/domains/eloquent/providers/EloquentQueryProvider";
import LoggerProvider from "@src/core/domains/logger/providers/LoggerProvider";
import ValidatorProvider from "@src/core/domains/validator/providers/ValidatorProvider";
import Kernel, { KernelConfig } from "@src/core/Kernel";
import { AppSingleton } from "@src/core/services/App";
import TestApiTokenModel from "@src/tests/larascript/models/models/TestApiTokenModel";
import TestUser from "@src/tests/larascript/models/models/TestUser";
import TestAuthProvider from "@src/tests/larascript/providers/TestAuthProvider";
import TestConsoleProvider from "@src/tests/larascript/providers/TestConsoleProvider";
import TestCryptoProvider from "@src/tests/larascript/providers/TestCryptoProvider";
import TestDatabaseProvider, { testDbName } from "@src/tests/larascript/providers/TestDatabaseProvider";
import TestEventProvider from "@src/tests/larascript/providers/TestEventProvider";
import TestMigrationProvider from "@src/tests/larascript/providers/TestMigrationProvider";
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

    const config: KernelConfig = {
        environment: EnvironmentTesting,
        providers: [
            new LoggerProvider(),
            new TestConsoleProvider(),
            new TestDatabaseProvider(),
            new EloquentQueryProvider(),
            new TestEventProvider(),
            new TestAuthProvider(),
            new TestMigrationProvider(),
            new ValidatorProvider(),
            new TestCryptoProvider(),
            new AccessControlProvider()
        ]
    }

    await Kernel.boot(config, {});
}


/**
 * Creates the auth tables in the database
 * @remarks
 * This function creates the `users` and `api_tokens` tables in the database
 * @param connectionName The name of the database connection to use
 */
export const createAuthTables = async (connectionName?: string) => {
    const schema = AppSingleton.container('db').schema(connectionName)

    const userTable = (new TestUser).table;
    const apiTokenTable = (new TestApiTokenModel).table;

    const stringNullable = {
        type: DataTypes.STRING,
        allowNull: true
    }

    await schema.createTable(userTable, {
        email: DataTypes.STRING,
        hashedPassword: DataTypes.STRING,
        groups: DataTypes.ARRAY(DataTypes.STRING),
        roles: DataTypes.ARRAY(DataTypes.STRING),
        firstName: stringNullable,
        lastName: stringNullable,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE

    })

    await schema.createTable(apiTokenTable, {
        userId: DataTypes.STRING,
        token: DataTypes.STRING,
        scopes: DataTypes.JSON,
        options: DataTypes.JSON,
        revokedAt: DataTypes.DATE,
        expiresAt: DataTypes.DATE,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    })
}

/**
 * Drops the `users` and `api_tokens` tables in the database
 * @remarks
 * This function removes the `users` and `api_tokens` tables from the database
 * @param connectionName The name of the database connection to use
 */
export const dropAuthTables = async (connectionName?: string) => {
    const schema = AppSingleton.container('db').schema(connectionName)

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
    await AppSingleton.container('console').readerService(['migrate:fresh', '--group=testing', '--seed']).handle();
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
    await AppSingleton.container('console').readerService(['migrate:down', '--group=testing']).handle();
}

/**
 * Retrieves a list of test database connection names, excluding any specified.
 * @param exclude An array of connection names to exclude from the result.
 * @returns An array of connection names, excluding those specified in the `exclude` parameter.
 */
export const getTestConnectionNames = ({ exclude = [] }: { exclude?: string[] } = {}) => {
    return ['mongodb', 'postgres'].filter(connectionName => !exclude.includes(connectionName));
}

/**
 * Runs the given function once for every test connection name, excluding any in the `exclude` array
 * @param fn The function to run for each test connection name
 * @example
 * await forEveryConnection(async connectionName => {
 *     console.log(`Running test for connection ${connectionName}`)
 * })
 */
// eslint-disable-next-line no-unused-vars
export type ForEveryConnectionFn = (connectionName: string) => Promise<void>
export type ForEveryConnectionOptions = {
    only?: string[]
    exclude?: string[]
}
export const forEveryConnection = async (fn: ForEveryConnectionFn, options: ForEveryConnectionOptions = {}) => {
    const connectionNames = getTestConnectionNames(options)
    for (const connectionName of connectionNames) {
        if (options.only && !options.only.includes(connectionName)) continue;
        if (options.exclude && options.exclude.includes(connectionName)) continue;

        console.log('[forEveryConnection]: ' + connectionName)
        await fn(connectionName)
    }
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