import BaseProvider from "@src/core/base/Provider";

class BaseRoutesProvider extends BaseProvider {

    async register(): Promise<void> {
        this.bind('routes.provided', true);
    }

}


export default BaseRoutesProvider;