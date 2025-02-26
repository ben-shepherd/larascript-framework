import BaseProvider from "@src/core/base/Provider";

import SessionService from "../services/SessionService";

class SessionProvider extends BaseProvider{

    async register(): Promise<void> {
        this.bind('session', new SessionService())
    }

}

export default SessionProvider
