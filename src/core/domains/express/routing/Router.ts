import { TExpressMiddlewareFnOrClass } from "../interfaces/IMiddleware";
import { IRouteGroupOptions, IRouter, TRouteGroupFn, TRouteItem, TRouteResourceOptions } from "../interfaces/IRoute";
import ResourceRouter from "./RouteResource";

class Router implements IRouter {

    /**
     * The route group options.
     */
    options: IRouteGroupOptions | null = null;

    previousOptions: IRouteGroupOptions | null = null;

    /**
     * The registered routes.
     */
    registered: TRouteItem[] = [];

    /**
     * Get the registered routes.
     */
    public getRegisteredRoutes(): TRouteItem[] {
        return this.registered;
    }

    /**
     * Register a GET route.
     */
    public get(path: TRouteItem['path'], action: TRouteItem['action']): void {
        this.register({ path, method: 'GET', action });
    }
    
    /**
         * Register a POST route.
         */
    public post(path: TRouteItem['path'], action: TRouteItem['action']): void {
        this.register({ path, method: 'POST', action });
    }
    
    /**
     * Register a PUT route.
     */
    public put(path: TRouteItem['path'], action: TRouteItem['action']): void {
        this.register({ path, method: 'PUT', action });
    }
    
    /**
     * Register a PATCH route.
     */
    public patch(path: TRouteItem['path'], action: TRouteItem['action']): void {
        this.register({ path, method: 'PATCH', action });
    }
    
    /**
     * Register a DELETE route.
     */
    public delete(path: TRouteItem['path'], action: TRouteItem['action']): void {
        this.register({ path, method: 'DELETE', action });
    }

    public resource(options: TRouteResourceOptions & Partial<TRouteItem>): void {
        ResourceRouter.resource(options, this);
    }
       
    /**
     * Create a new group of routes.
     * 
     * The flow of this method:
     * 1. Saves current options to restore them later
     * 2. If first arg is a function, executes it directly with current router
     * 3. Otherwise, merges new options with existing ones (prefixes, names, etc)
     * 4. Executes the router function if provided to add routes with merged options
     * 5. Restores previous options so routes added after group() use original options
     * 
     */
    public group(options: IRouteGroupOptions | TRouteGroupFn, routerFn?: TRouteGroupFn): IRouter {

        // Save the current options
        this.previousOptions = {...this.options};
        
        // If the first argument is a function, it is a router function
        if (typeof options === 'function') {
            routerFn = options as TRouteGroupFn;
            options = {} as IRouteGroupOptions;
        }

        // Apply the options - this will combine options from parent groups
        // For example, if parent group has prefix '/api' and child group has prefix '/users'
        // The resulting prefix will be '/api/users'
        // Similarly, if parent group has name 'api.' and child group has name 'users'
        // The resulting name will be 'api.users'
        this.applyOptions(this, options);

        // If there is a router function, apply it
        if (routerFn) {
            routerFn(this);
        }

        // Reset to the previous options
        this.resetOptions();

        return this;
    }

    protected resetOptions(): void {
        this.options = {...(this.previousOptions ?? {})};
    }

    /**
     * Apply the options to the route.
     */
    public applyOptions(route: IRouter, options: IRouteGroupOptions): void {
        const newOptions = {...this.options, ...options};
        newOptions.name = this.concat(this.options?.name, options?.name);
        newOptions.prefix = this.concat(this.options?.prefix, options?.prefix);
        this.applyOptionsMiddleware(route, newOptions);
        this.options = {...newOptions};

    }

    /**
     * Apply the middleware options to the route.
     */
    public applyOptionsMiddleware(route: IRouter, options: IRouteGroupOptions): void {
        const currentMiddlewareOrDefault = this.options?.middlewares ?? [] as TExpressMiddlewareFnOrClass[];
        const currentMiddleware = (Array.isArray(currentMiddlewareOrDefault) ? currentMiddlewareOrDefault : [currentMiddlewareOrDefault]) as TExpressMiddlewareFnOrClass[];
        
        const optionsMiddlewareOrDefault = route.options?.middlewares ?? [] as TExpressMiddlewareFnOrClass[];
        const optionsMiddleware = (Array.isArray(optionsMiddlewareOrDefault) ? optionsMiddlewareOrDefault : [optionsMiddlewareOrDefault]) as TExpressMiddlewareFnOrClass[];

        options.middlewares = [...currentMiddleware, ...optionsMiddleware] as TExpressMiddlewareFnOrClass[];

        // Remove middleware duplicates
        options.middlewares = options.middlewares.filter((middleware, index, self) => {
            return self.indexOf(middleware) === index;
        });
    }

    /**
     * Concatenate two strings with a delimiter.
     */
    protected concat(value1?: string, value2?: string, delimiter: string = ''): string {
        value1 = value1 ?? '';
        value2 = value2 ?? '';
        return `${value1}${delimiter}${value2}`;
    }

    /**
     * Register a route.
     */
    public register({ path, method, action }: Partial<TRouteItem>): void {

        const routeItem = {
            ...this.options,
            path: this.getPath(path ?? ''),
            method: method ?? 'GET',
            action: action ?? '',
        }

        console.log('[Router] register', routeItem)
        this.registered.push(routeItem);
    }

    /**
     * Get the path with the prefix and formatted parameters.
     */
    protected getPath(path: string): string {
        // Add prefix if it doesn't start with a forward slash
        const pathWithPrefixForwardSlash = path.startsWith('/') ? path : `/${path}`;
        // Remove suffix forward slash if it ends with a forward slash
        const pathWitoutSuffixForwardSlash = pathWithPrefixForwardSlash.endsWith('/') ? pathWithPrefixForwardSlash.slice(0, -1) : pathWithPrefixForwardSlash;
        // Combine prefix and path
        const combinedPath = this.concat(this.options?.prefix, pathWitoutSuffixForwardSlash);
        // Format path parameters to express format (e.g. /{id} -> /:id)
        const formattedPath = combinedPath.replace(/\{(\w+)\}/g, ':$1');

        return formattedPath;
    }

}

export default Router