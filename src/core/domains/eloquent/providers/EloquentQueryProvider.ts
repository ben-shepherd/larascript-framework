import BaseProvider from "@src/core/base/Provider";
import { App } from "@src/core/services/App";
import EloquentQueryBuilderService from "@src/core/domains/eloquent/services/EloquentQueryBuilderService";

class EloquentQueryProvider extends BaseProvider {

    /**
     * EloquentQueryProvider class
     * 
     * This provider is responsible for registering the QueryService into the App container.
     * The QueryService provides a fluent interface for database queries using the Eloquent ORM pattern.
     * 
     * @extends BaseProvider
     * @see BaseProvider
     * @see EloquentQueryBuilderService
     */
    async register() {
        App.setContainer('query', new EloquentQueryBuilderService());
    }

}

export default EloquentQueryProvider;