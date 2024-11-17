/* eslint-disable no-unused-vars */
import BaseConfig from "@src/core/base/BaseConfig";
import { ICtor } from "@src/core/interfaces/ICtor";

import { IDatabaseAdapter } from "../interfaces/IDatabaseAdapter";
import { IDatabaseGenericConnectionConfig } from "../interfaces/IDatabaseConfig";
import { IDatabaseSchema } from "../interfaces/IDatabaseSchema";
import { IDocumentManager } from "../interfaces/IDocumentManager";

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

    abstract getQueryBuilderCtor(): ICtor<unknown>;

    abstract isConnected(): Promise<boolean>;

    abstract getDockerComposeFileName(): string;

    abstract getDefaultCredentials(): string | null;

}

export default BaseDatabaseAdapter