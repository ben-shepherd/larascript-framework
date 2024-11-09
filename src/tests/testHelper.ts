import AuthProvider from "@src/core/domains/auth/providers/AuthProvider";
import Kernel from "@src/core/Kernel";
import { App } from "@src/core/services/App";
import testAppConfig from "@src/tests/config/testConfig";
import TestConsoleProvider from "@src/tests/providers/TestConsoleProvider";
import TestDatabaseProvider from "@src/tests/providers/TestDatabaseProvider";
import TestEventProvider from "@src/tests/providers/TestEventProvider";

const testDbName = 'test_db';

const testBootApp = async () => {
    await Kernel.boot({
        ...testAppConfig,
        providers: [
            ...testAppConfig.providers,
            new TestConsoleProvider(),
            new TestDatabaseProvider(),
            new TestEventProvider(),
            new AuthProvider()
        ]
    }, {});
}

const runFreshMigrations = async () => {
    await App.container('console').reader(['migrate:fresh', '--group=testing', '--seed']).handle();
}

const clearMigrations = async () => {
    await App.container('console').reader(['migrate:down', '--group=testing']).handle();
}

const testHelper = {
    testBootApp,
    runFreshMigrations,
    clearMigrations,
    testDbName
} as const

export default testHelper