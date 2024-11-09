import { EnvironmentTesting } from "@src/core/consts/Environment";
import AuthProvider from "@src/core/domains/auth/providers/AuthProvider";
import LoggerProvider from "@src/core/domains/logger/providers/LoggerProvider";
import Kernel from "@src/core/Kernel";
import { App } from "@src/core/services/App";
import TestConsoleProvider from "@src/tests/providers/TestConsoleProvider";
import TestDatabaseProvider, { testDbName } from "@src/tests/providers/TestDatabaseProvider";
import TestEventProvider from "@src/tests/providers/TestEventProvider";

export const getTestDbName = () => testDbName

const testBootApp = async () => {
    await Kernel.boot({
        environment: EnvironmentTesting,
        providers: [
            new LoggerProvider(),
            new TestConsoleProvider(),
            new TestDatabaseProvider(),
            new TestEventProvider(),
            new AuthProvider(),
        ]
    }, {});
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
    getTestConnectionNames
} as const

export default testHelper