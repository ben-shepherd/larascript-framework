import appConfig from "@src/config/app.config";
import providers from "@src/config/providers.config";
import Singleton from "@src/core/base/Singleton";
import { EnvironmentProduction } from "@src/core/consts/Environment";
import Kernel from "@src/core/Kernel";
import { App, app } from "@src/core/services/App";
import testHelper from "@src/tests/testHelper";

export type TinkerServiceConfig = {
    useTestDb: boolean
}

/**
 * TinkerService provides a way to boot the application in different environments,
 * particularly useful for development and testing scenarios.
 * 
 * This service can initialize either a regular database connection or a test database
 * connection based on the configuration provided.
 */
class TinkerService extends Singleton<TinkerServiceConfig> {

    /**
     * Boots the TinkerService
     * @param config - Configuration options for the service
     * @param config.useTestDb - When true, boots with test database. When false, uses regular database
     * @returns A promise that resolves when the service is booted
     */
    public static async boot(config: TinkerServiceConfig) {
        
        if(App.env() === EnvironmentProduction) {
            throw new Error('TinkerService is not allowed in production environment');
        }

        return await (new TinkerService(config)).init();
    }

    /**
     * Boots the application with either test or regular database based on configuration
     */
    public async init() {
        if(!this.config) {
            throw new Error('TinkerService config is not set');
        }

        if(this.config.useTestDb) {
            await this.bootTestDb();
            return;
        }

        await this.bootDb();
    }

    /**
     * Boots the application with regular database configuration
     * Uses the application's environment and provider settings
     */
    protected async bootDb(): Promise<void> {
        await Kernel.boot({
            environment: appConfig.env,
            providers: providers
        }, {});
    }

    /**
     * Boots the application with test database configuration
     * Runs migrations and seeds the database with test data
     */
    protected async bootTestDb(): Promise<void> {
        await testHelper.testBootApp();
        await app('console').readerService(['migrate:fresh', '--seed']).handle();
    }

}

export default TinkerService;