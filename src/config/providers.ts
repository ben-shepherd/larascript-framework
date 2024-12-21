import { IAppService } from "@src/app/interfaces/IAppService";
import AppProvider from "@src/app/providers/AppProvider";
import RoutesProvider from "@src/app/providers/RoutesProvider";
import { ILarascriptProviders } from "@src/core/interfaces/ILarascriptProviders";
import { IProvider } from "@src/core/interfaces/IProvider";
import LarascriptProviders from "@src/core/providers/LarascriptProviders";

/**
 * Interface defining all available service providers in the application.
 * This interface provides TypeScript type hints when accessing providers using app('serviceName').
 * 
 * @example
 * // TypeScript will provide autocomplete and type checking:
 * const logger = app('logger'); // Returns ILoggerService
 * const auth = app('auth');     // Returns IAuthService
 * 
 * @see {@link ILarascriptProviders} for core service definitions
 */

export interface Providers extends ILarascriptProviders {

    // App Providers
    app: IAppService;

    // Add your provider interfaces here
}

/**
 * Providers
 */
export default [

    // Include the core providers
    ...LarascriptProviders,

    // Add your providers here
    new RoutesProvider(),
    new AppProvider(),

] as IProvider[];