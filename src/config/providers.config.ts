import { IAppService } from "@src/app/interfaces/IAppService";
import AppServiceProvider from "@src/app/providers/AppServiceProvider";
import RoutesProvider from "@src/app/providers/RoutesProvider";
import HttpErrorHandlerProvider from "@src/core/domains/http/providers/HttpErrorHandlerProvider";
import { ILarascriptProviders } from "@src/core/interfaces/ILarascriptProviders";
import { IProvider } from "@src/core/interfaces/IProvider";
import LarascriptProviders from "@src/core/providers/LarascriptProviders";

import { IAppConfig } from "./app.config";
;

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
    'app.config': IAppConfig;
    
    // Add your provider interfaces here
}

/**
 * Providers
 */
const providers: IProvider[] = [

    // Include the core providers
    ...LarascriptProviders,

    // Routes and express error handlers
    new RoutesProvider(),
    new HttpErrorHandlerProvider(),

    // Add your providers here
    new AppServiceProvider(),

]

export default providers;