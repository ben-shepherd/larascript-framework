import { EnvironmentTesting } from "@src/core/consts/Environment";
import LoggerProvider from "@src/core/domains/logger/providers/LoggerProvider";
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

const testBootApp = async () => {
    await Kernel.boot({
        environment: EnvironmentTesting,
        providers: [
            new LoggerProvider(),
            new TestConsoleProvider(),
            new TestDatabaseProvider(),
            new TestEventProvider(),
            new TestAuthProvider(),
            new TestMigrationProvider()
        ]
    }, {});
}


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

export const dropAuthTables = async(connectionName?: string) => {
    const schema = App.container('db').schema(connectionName)

    const userTable = (new TestUser).table;
    const apiTokenTable = (new TestApiTokenModel).table;

    await schema.dropTable(userTable);
    await schema.dropTable(apiTokenTable);
}

const runFreshMigrations = async () => {
    await App.container('console').reader(['migrate:fresh', '--group=testing', '--seed']).handle();
}

const clearMigrations = async () => {
    await App.container('console').reader(['migrate:down', '--group=testing']).handle();
}

export const getTestConnectionNames = ({ exclude = [] }: { exclude?: string[] } = {}) => {
    return ['mongodb', 'postgres'].filter(connectionName => !exclude.includes(connectionName));
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