import Middleware from '@src/core/domains/http/base/Middleware';
import HttpContext from '@src/core/domains/http/context/HttpContext';
import { requestContext } from '@src/core/domains/http/context/RequestContext';
import { TBaseRequest } from '@src/core/domains/http/interfaces/BaseRequest';
import { IRouter } from '@src/core/domains/http/interfaces/IRouter';
import ApiResponse from '@src/core/domains/http/response/ApiResponse';
import Route from '@src/core/domains/http/router/Route';
import { app } from '@src/core/services/App';
import crypto from 'crypto';
import { Request } from 'express';

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

    /** Exclude routes from CSRF protection */
    exclude?: string[];
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

    /**
     * Creates a new instance of CsrfMiddleware
     * @param config - Optional configuration to override defaults
     */
    constructor() {
        super();

        this.setConfig(
            app('http').getConfig()?.csrf as CsrfConfig
        );
    }

    /**
     * Creates a router that exposes a CSRF token endpoint
     * 
     * @param url - The URL path to mount the CSRF endpoint (defaults to '/csrf')
     * @returns A router instance with the CSRF endpoint configured
     */
    public static getRouter(url: string = '/csrf'): IRouter {
        return Route.group({
            prefix: url,
        }, router => {
            router.get('/', (req, res) => {
                res.json(
                    new ApiResponse()
                        .setData({
                            token: CsrfMiddleware.getCsrfToken(req)
                        })
                        .toResponseObject()
                )
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
        const path = context.getRequest().path;
        const exclude = this.getConfig()?.exclude ?? [];

        if (this.isUrlExcluded(path, exclude)) {
            return this.next();
        }

        const req = context.getRequest();
        const res = context.getResponse();

        // Generate token if it doesn't exist
        const token = CsrfMiddleware.getCsrfToken(req);

        // Set header
        res.setHeader(this.getConfig()?.headerName ?? 'x-xsrf-token', token);

        // Validate token for specified HTTP methods
        if (this.getConfig()?.methods?.includes(req.method)) {
            const headerToken = req.headers[this.getConfig()?.headerName?.toLowerCase() ?? 'x-xsrf-token'];

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