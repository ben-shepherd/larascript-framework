/* eslint-disable no-unused-vars */
import BaseConfig from "@src/core/base/BaseConfig";
import { IDatabaseAdapter } from "@src/core/domains/database/interfaces/IDatabaseAdapter";
import { IDatabaseGenericConnectionConfig } from "@src/core/domains/database/interfaces/IDatabaseConfig";
import { IDatabaseSchema } from "@src/core/domains/database/interfaces/IDatabaseSchema";
import { IDocumentManager } from "@src/core/domains/database/interfaces/IDocumentManager";
import { ICtor } from "@src/core/interfaces/ICtor";
import { IModel } from "@src/core/interfaces/IModel";

import { IEloquent } from "../../eloquent/interfaces/IEloquent";

abstract class BaseDatabaseAdapter<TClient = unknown, TConfig extends object = object> extends BaseConfig implements IDatabaseAdapter {
    
    /**
     * Database client
     */
    protected client!: TClient;
    
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
    protected dockerComposeFileName?: string;

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
     * Set the database client
     * @param client The database client
     */
    setClient(client: TClient): void {
        this.client = client
    }

    /**
     * Retrieves the current database client instance.
     *
     * @returns {TClient} The database client instance.
     */
    getClient(): TClient {
        return this.client
    }

    abstract connect(): Promise<unknown>;

    abstract connectToDatabase(...args: any[]): Promise<unknown>;

    abstract getDocumentManager(): IDocumentManager;

    abstract getSchema(): IDatabaseSchema;

    abstract getEloquentConstructor<Model extends IModel = IModel>(): ICtor<IEloquent<Model>>;

    abstract isConnected(): Promise<boolean>;

    abstract getDockerComposeFileName(): string;

    abstract getDefaultCredentials(): string | null;

    abstract createMigrationSchema(...args: any[]): Promise<unknown>;

}

export default BaseDatabaseAdapter