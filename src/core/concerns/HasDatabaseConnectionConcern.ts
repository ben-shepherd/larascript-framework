import { IBroadcaster } from "@src/core/domains/broadcast/interfaces/IBroadcaster";
import { IDatabaseSchema } from "@src/core/domains/database/interfaces/IDatabaseSchema";
import { IDocumentManager } from "@src/core/domains/database/interfaces/IDocumentManager";
import { IHasDatabaseConnection } from "@src/core/interfaces/concerns/IHasDatabaseConnection";
import { ICtor } from "@src/core/interfaces/ICtor";
import { App } from "@src/core/services/App";

const HasDatabaseConnectionConcern = (Base: ICtor<IBroadcaster>) => {
    return class HasDatabaseConnection extends Base implements IHasDatabaseConnection {

        /**
         * The name of the database connection to use.
         * Defaults to the application's default connection name.
         */
        public connection: string = App.container('db').getDefaultConnectionName();

        /**
         * The name of the MongoDB collection associated with this model.
         * Must be set by child classes or will be automatically generated.
         */
        public table!: string;

        /**
         * Gets the document manager for database operations.
         * 
         * @returns {IDocumentManager} The document manager instance.
         */
        getDocumentManager(): IDocumentManager {
            return App.container('db').documentManager(this.connection).table(this.table);
        }
    
        /**
         * Gets the schema interface for the database.
         * 
         * @returns {IDatabaseSchema} The schema interface.
         */
        getSchema(): IDatabaseSchema {
            return App.container('db').schema(this.connection);
        }
    
    }
}

export default HasDatabaseConnectionConcern