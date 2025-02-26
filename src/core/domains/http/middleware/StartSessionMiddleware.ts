import Middleware from '@src/core/domains/http/base/Middleware';
import HttpContext from '@src/core/domains/http/context/HttpContext';
import { session } from '@src/core/domains/session/services/SessionService';

class StartSessionMiddleware extends Middleware {

    public async execute(context: HttpContext): Promise<void> {
        // Get request ID to use as session ID
        const sessionId = context.getId();

        // Run the rest of the middleware chain within a session context
        await session().runWithSession(async () => {
            // Set the session ID
            const currentSession = session().getSession();
            currentSession.id = sessionId;
            
            // Continue middleware chain
            this.next();
        });
    }

}

export default StartSessionMiddleware; 