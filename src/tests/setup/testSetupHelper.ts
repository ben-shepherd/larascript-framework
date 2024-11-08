import AuthProvider from "@src/core/domains/auth/providers/AuthProvider";
import Kernel from "@src/core/Kernel";
import { App } from "@src/core/services/App";

import testAppConfig from "../config/testConfig";
import TestConsoleProvider from "../providers/TestConsoleProvider";
import TestDatabaseProvider from "../providers/TestDatabaseProvider";
import TestEventProvider from "../providers/TestEventProvider";

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

const testHelperSetup = {
    testBootApp,
    runFreshMigrations,
    clearMigrations,
} as const

export default testHelperSetup