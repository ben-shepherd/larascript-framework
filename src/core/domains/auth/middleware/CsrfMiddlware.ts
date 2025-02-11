import Middleware from '@src/core/domains/http/base/Middleware';
import HttpContext from '@src/core/domains/http/context/HttpContext';
import crypto from 'crypto';


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

    async execute(context: HttpContext): Promise<void> {
        const config: CsrfConfig = { ...CsrfMiddleware.DEFAULT_CONFIG, ...this.getConfig() } as CsrfConfig;

        const req = context.getRequest();
        const res = context.getResponse();
        
        // Generate token if it doesn't exist
        let token = context.getIpContext<{ value: string }>('csrf-token')?.value;

        if (!token) {
            token = this.generateToken();
            context.setIpContext('csrf-token', token, config.ttl);
            
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

    private generateToken(): string {
        return crypto.randomBytes(32).toString('hex');
    }

    private forbidden(message: string): void {
        this.context.getResponse()
            .status(403)
            .json({ error: message });
    }

}

export default CsrfMiddleware;