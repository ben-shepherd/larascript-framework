/* eslint-disable no-unused-vars */
import BaseConfig from "@src/core/base/BaseConfig";
import { IDatabaseAdapter } from "@src/core/domains/database/interfaces/IDatabaseAdapter";
import { IDatabaseGenericConnectionConfig } from "@src/core/domains/database/interfaces/IDatabaseConfig";
import { IDatabaseSchema } from "@src/core/domains/database/interfaces/IDatabaseSchema";
import { IDocumentManager } from "@src/core/domains/database/interfaces/IDocumentManager";
import { ICtor } from "@src/core/interfaces/ICtor";
import { IModel } from "@src/core/interfaces/IModel";
import { IEloquent } from "@src/core/domains/eloquent/interfaces/IEloquent";

abstract class BaseDatabaseAdapter<TConfig extends object = object> extends BaseConfig implements IDatabaseAdapter {

    /**
     * Database config
     */
    protected config!: IDatabaseGenericConnectionConfig<TConfig>;

    /**
     * Database connection name
     */
    protected connectionName!: string;

    /**
     * Docker compose file name
     */
    protected dockerComposeFileName!: string;

    /**
     * Set the connection name
     * @param connectionName The name of the connection
     */
    setConnectionName(connectionName: string): void {
        this.connectionName = connectionName
    }

    /**
     * Get the connection name
     * @returns The connection name
     */
    getConnectionName(): string {
        return this.connectionName
    }
    
    /**
     * Retrieves the name of the Docker Compose file associated with the database.
     *
     * @returns {string} The Docker Compose file name.
     */
    getDockerComposeFileName(): string {
        if(!this.dockerComposeFileName) {
            throw new Error('Docker compose file name not set')
        }
        return this.dockerComposeFileName
    }

    /**
     * Connect to the default database
     */
    abstract connectDefault(): Promise<unknown>;

    /**
     * Check if the database is connected
     */
    abstract isConnected(): Promise<boolean>;

    /**
     * @deprecated
     */
    abstract getDocumentManager(): IDocumentManager;

    /**
     * Get the database schema manager
     */
    abstract getSchema(): IDatabaseSchema;

    /**
     * Get the Eloquent constructor
     */
    abstract getEloquentConstructor<Model extends IModel = IModel>(): ICtor<IEloquent<Model>>;

    /**
     * Get the default credentials
     */
    abstract getDefaultCredentials(): string | null;

    /**
     * Create a migration schema
     */
    abstract createMigrationSchema(...args: any[]): Promise<unknown>;

}

export default BaseDatabaseAdapter