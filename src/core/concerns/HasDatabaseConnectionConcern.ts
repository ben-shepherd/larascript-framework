import { IDatabaseSchema } from "@src/core/domains/database/interfaces/IDatabaseSchema";
import { IDocumentManager } from "@src/core/domains/database/interfaces/IDocumentManager";
import { IHasDatabaseConnection } from "@src/core/interfaces/concerns/IHasDatabaseConnection";
import { ICtor } from "@src/core/interfaces/ICtor";
import { App } from "@src/core/services/App";

import { db } from "../domains/database/services/Database";


/**
 * A concern that provides database connection capabilities to a class.
 * 
 * Automatically injects the `connection` and `table` properties, as well as
 * the `getDocumentManager` and `getSchema` methods.
 * 
 * To use this concern, simply call it in the class definition, like so:
 * 
 * class MyModel extends HasDatabaseConnection(Base) {
 *     
 * }
 * 
 * @param Base The class to extend.
 * @returns A class that extends Base and implements IHasDatabaseConnection.
 */
const HasDatabaseConnectionConcern = (Base: ICtor) => {
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
            return db().documentManager(this.connection).table(this.table);
        }

        /**
         * Gets the document manager for database operations.
         * 
         * @returns {IDocumentManager} The document manager instance.
         */
        setConnectionName(connectionName: string) {
            this.connection = connectionName;
        }
    
        /**
         * Gets the schema interface for the database.
         * 
         * @returns {IDatabaseSchema} The schema interface.
         */
        getSchema(): IDatabaseSchema {
            return db().schema(this.connection);
        }
    
    }
}

export default HasDatabaseConnectionConcern