import AuthProvider from "@src/core/domains/auth/providers/AuthProvider";
import ConsoleProvider from "@src/core/domains/console/providers/ConsoleProvider";
import DatabaseProvider from "@src/core/domains/database/providers/DatabaseProvider";
import EventProvider from "@src/core/domains/events/providers/EventProvider";
import ExpressProvider from "@src/core/domains/express/providers/ExpressProvider";
import LoggerProvider from "@src/core/domains/logger/providers/LoggerProvider";
import MakeProvider from "@src/core/domains/make/providers/MakeProvider";
import MigrationProvider from "@src/core/domains/migrations/providers/MigrationProvider";
import SetupProvider from "@src/core/domains/setup/providers/SetupProvider";
import ValidatorProvider from "@src/core/domains/validator/providers/ValidatorProvider";
import { IProvider } from "@src/core/interfaces/IProvider";
import EloquentQueryProvider from "@src/core/domains/eloquent/providers/EloquentQueryProvider";

/**
 * Core providers for the framework
 *
 * These providers are loaded by default when the application boots
 *
 * @see {@link IProvider} for more information about providers
 */
const CoreProviders: IProvider[] = [

    /**
     * Logger provider
     * 
     * Provides logging services by utilising winston
     */
    new LoggerProvider(),

    /**
     * Console provider
     *
     * Provides console commands and helpers
     */
    new ConsoleProvider(),

    /**
     * Event provider
     *
     * Provides events and listeners
     */
    new EventProvider(),

    /**
     * Database provider
     *
     * Provides database connections and document managers
     */
    new DatabaseProvider(),

    /**
     * Eloquent Query provider
     * 
     * Provides Eloquent-style query builder and model functionality
     */
    new EloquentQueryProvider(),

    /**
     * Express provider
     *
     * Provides an Express.js server
     */
    new ExpressProvider(),

    /**
     * Auth provider
     *
     * Provides authentication and authorization services
     */
    new AuthProvider(),

    /**
     * Migration provider
     *
     * Provides migrations and database schema management
     */
    new MigrationProvider(),

    /**
     * Make provider
     *
     * Provides commands to generate code and setup the application
     */
    new MakeProvider(),

    /**
     * Validator provider
     *
     * Provides validation services
     */
    new ValidatorProvider(),

    /**
     * Setup provider
     *
     * Provides setup commands and helpers
     */
    new SetupProvider(),


];

export default CoreProviders