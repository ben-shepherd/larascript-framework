import Middleware from '@src/core/domains/http/base/Middleware';
import HttpContext from '@src/core/domains/http/context/HttpContext';
import { app } from '@src/core/services/App';
import crypto from 'crypto';
import { Request } from 'express';

import { requestContext } from '../../http/context/RequestContext';
import { TBaseRequest } from '../../http/interfaces/BaseRequest';
import { IRouter } from '../../http/interfaces/IRouter';
import Route from '../../http/router/Route';

/**
 * Configuration options for CSRF protection
 */
interface CsrfConfig {

    /** HTTP methods that require CSRF validation */
    methods?: string[];

    /** Cookie name for the CSRF token */
    cookieName?: string;

    /** Header name for the CSRF token */
    headerName?: string;

    /** How long the token is valid for (in seconds) */
    ttl?: number;
}

/**
 * Middleware for Cross-Site Request Forgery (CSRF) protection.
 * Generates and validates CSRF tokens for specified HTTP methods.
 * 
 * @example
 * ```typescript
 * // 1. Apply globally via http.config.ts
 * const config: IExpressConfig = {
 *   globalMiddlewares: [
 *     CsrfMiddleware,
 *     // ... other middlewares
 *   ],
 *   csrf: {
 *     exclude: ['/auth/*'] // Exclude routes from CSRF protection
 *   }
 * };
 * 
 * // 2. Apply to specific routes in route files
 * router.post('/update-post', [UpdatePostController, 'invoke'], {
 *   middlewares: [CsrfMiddleware]
 * });
 * 
 * // 3. Apply to route groups
 * Route.group({
 *   prefix: '/blog',
 *   middlewares: [CsrfMiddleware]
 * }, router => {
 *   // All routes in this group will have CSRF protection
 * });
 * 
 * 
 * ```
 */
class CsrfMiddleware extends Middleware<CsrfConfig> {

    private static readonly DEFAULT_CONFIG: CsrfConfig = {
        methods: ['POST', 'PUT', 'PATCH', 'DELETE'],
        cookieName: 'x-xsrf-token',
        headerName: 'x-xsrf-token',
        ttl: 24 * 60 * 60 // 24 hours
    };

    /**
     * Creates a new instance of CsrfMiddleware
     * @param config - Optional configuration to override defaults
     */
    constructor(config?: CsrfConfig) {
        super();
        this.setConfig(config ?? CsrfMiddleware.DEFAULT_CONFIG);
    }

    /**
     * Creates a router that exposes a CSRF token endpoint
     * 
     * @param url - The URL path to mount the CSRF endpoint (defaults to '/csrf')
     * @returns A router instance with the CSRF endpoint configured
     * 
     * @example
     * ```typescript
     * // Mount at default /csrf path
     * app.use(CsrfMiddleware.getRouter());
     * 
     * // Mount at custom path
     * app.use(CsrfMiddleware.getRouter('/security/csrf'));
     * ```
     */
    public static getRouter(url: string = '/csrf'): IRouter {
        return Route.group({
            prefix: url,
        }, router => {
            router.get('/', (req, res) => {
                res.json({
                    token: CsrfMiddleware.getCsrfToken(req)
                })
            })
        })
    }

    /**
     * Generates or retrieves an existing CSRF token for the request
     * 
     * @param req - The Express request object
     * @returns The CSRF token string
     */
    public static getCsrfToken(req: Request) {
        let token = requestContext().getByIpAddress<{ value: string }>(req as TBaseRequest, 'csrf-token')?.value;

        if (!token) {
            token = crypto.randomBytes(32).toString('hex');
            requestContext().setByIpAddress(req as TBaseRequest, 'csrf-token', token, 24 * 60 * 60);
        }

        return token;
    }

    /**
     * Executes the CSRF middleware
     * - Generates CSRF token if none exists
     * - Sets CSRF cookie
     * - Validates token for specified HTTP methods
     * 
     * @param context - The HTTP context for the current request
     */
    async execute(context: HttpContext): Promise<void> {
        const config: CsrfConfig = { ...CsrfMiddleware.DEFAULT_CONFIG, ...this.getConfig() } as CsrfConfig;
        const httpConfig = app('http').getConfig();
        const path = context.getRequest().path;
        const exclude = httpConfig?.csrf?.exclude ?? [];

        if (this.isUrlExcluded(path, exclude)) {
            return this.next();
        }

        const req = context.getRequest();
        const res = context.getResponse();
        
        // Generate token if it doesn't exist
        const token = CsrfMiddleware.getCsrfToken(req);

        // Set header
        res.setHeader(config.headerName ?? 'x-xsrf-token', token);

        // Validate token for specified HTTP methods
        if (config.methods?.includes(req.method)) {
            const headerToken = req.headers[config.headerName?.toLowerCase() ?? 'x-xsrf-token'];
        
            if (!headerToken || headerToken !== token) {
                return this.forbidden('Invalid CSRF token');
            }
        }

        this.next();    
    }

    /**
     * Sends a forbidden response with an error message
     * 
     * @param message - The error message to send
     * @private
     */
    private forbidden(message: string): void {
        this.context.getResponse()
            .status(403)
            .json({ error: message });
    }

    /**
     * Checks if a URL path matches any of the excluded patterns
     * 
     * @param path - The URL path to check
     * @param exclude - Array of patterns to match against
     * @returns True if the path matches any exclude pattern
     * @protected
     */
    protected isUrlExcluded(path: string, exclude: string[]): boolean {
        return exclude.some(pattern => {
            const regex = this.convertToRegex(pattern);
            return regex.test(path);
        });
    }
    
    /**
     * Converts a URL pattern to a regular expression
     * Supports basic wildcard (*) matching
     * 
     * @param match - The URL pattern to convert
     * @returns A RegExp object for matching URLs
     * @protected
     */
    protected convertToRegex(match: string): RegExp {
        match = '^' + match.replace('*', '.+') + '$';
        return new RegExp(match);
    }

}

export default CsrfMiddleware;