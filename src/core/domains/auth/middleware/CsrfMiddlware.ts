import Middleware from '@src/core/domains/http/base/Middleware';
import HttpContext from '@src/core/domains/http/context/HttpContext';
import { app } from '@src/core/services/App';
import crypto from 'crypto';
import { Request } from 'express';

import { requestContext } from '../../http/context/RequestContext';
import { TBaseRequest } from '../../http/interfaces/BaseRequest';
import { IRouter } from '../../http/interfaces/IRouter';
import Route from '../../http/router/Route';


interface CsrfConfig {
    // HTTP methods that require CSRF validation
    methods?: string[];
    // Cookie name for the CSRF token
    cookieName?: string;
    // Header name for the CSRF token
    headerName?: string;
    // How long the token is valid for (in seconds)
    ttl?: number;
}

class CsrfMiddleware extends Middleware<CsrfConfig> {

    private static readonly DEFAULT_CONFIG: CsrfConfig = {
        methods: ['POST', 'PUT', 'PATCH', 'DELETE'],
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN',
        ttl: 24 * 60 * 60 // 24 hours
    };

    constructor(config?: CsrfConfig) {
        super();
        this.setConfig(config ?? CsrfMiddleware.DEFAULT_CONFIG);
    }

    /**
     * Get the CSRF router
     * 
     * @returns 
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
     * Get the CSRF token
     * 
     * @param req 
     * @returns 
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
     * Execute the middleware
     * 
     * @param context 
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

        if (!token) {
            // Set cookie
            res.cookie(config.cookieName ?? 'XSRF-TOKEN', token, {
                httpOnly: false, // Allow JavaScript access
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });
        }

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
     * Forbidden
     * 
     * @param message 
     */
    private forbidden(message: string): void {
        this.context.getResponse()
            .status(403)
            .json({ error: message });
    }

    protected isUrlExcluded(path: string, exclude: string[]): boolean {
        return exclude.some(pattern => {
            const regex = this.convertToRegex(pattern);
            return regex.test(path);
        });
    }
    
    protected convertToRegex(match: string): RegExp {
        match = '^' + match.replace('*', '.+') + '$';
        return new RegExp(match);
    }

}

export default CsrfMiddleware;