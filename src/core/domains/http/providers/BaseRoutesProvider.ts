import { BaseProvider } from "@ben-shepherd/larascript-core-bundle";

class BaseRoutesProvider extends BaseProvider {

    async register(): Promise<void> {
        this.bind('routes.provided', true);
    }

}


export default BaseRoutesProvider;