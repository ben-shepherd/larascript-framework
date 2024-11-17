

import BaseRegister from "@src/core/base/BaseRegister";
import DatabaseConnectionException from "@src/core/domains/database/exceptions/DatabaseConnectionException";
import { IDatabaseAdapter } from "@src/core/domains/database/interfaces/IDatabaseAdapter";
import { IDatabaseConfig, IDatabaseGenericConnectionConfig } from "@src/core/domains/database/interfaces/IDatabaseConfig";
import { IDatabaseSchema } from "@src/core/domains/database/interfaces/IDatabaseSchema";
import { IDatabaseService } from "@src/core/domains/database/interfaces/IDatabaseService";
import { IDocumentManager } from "@src/core/domains/database/interfaces/IDocumentManager";
import DatabaseAdapter from "@src/core/domains/database/services/DatabaseAdapter";
import { ICtor } from "@src/core/interfaces/ICtor";
import { App } from "@src/core/services/App";

/**
 * Database Service
 * - Registers database adapters, connections 
 * - Connects to default and keep alive connections
 * 
 * Usage:
 *  App.container('db').provider(connectionName).documentManager().findMany({})
 */
class Database extends BaseRegister implements IDatabaseService {

    static readonly REGISTERED_ADAPTERS_CONFIG = 'registeredAdaptersConfig'

    static readonly REGISTERED_CONNECTIONS_CONFIG = 'registeredConnectionsConfig'

    static readonly REGISTERED_ADAPTERS_BY_CONNECTION = 'registeredAdaptersByConnection'

    protected config!: IDatabaseConfig;

    protected overrideDefaultConnectionName?: string;

    /**
     * Constructs an instance of the Database class.
     * 
     * @param config - The database configuration object implementing IDatabaseConfig interface.
     */
    constructor(config: IDatabaseConfig) {
        super()
        this.config = config
    }

    /**
     * @template T - The type of the configuration object to return. Defaults to IDatabaseConfig.
     * @returns {T} The database configuration object.
     */
    getConfig<T = IDatabaseConfig>(): T {
        return this.config as T
    }

    /**
     * @param config - The new database configuration object implementing IDatabaseConfig interface.
     */
    setConfig(config: IDatabaseConfig): void {
        this.config = config
    }

    /**
     * Logs a message to the console with the 'info' log level, prefixed with '[Database] '.
     * @param message - The message to log.
     * @param args - Additional arguments to log.
     * @private
     */
    private log(message: string, ...args: any[]): void {
        App.container('logger').info(`[Database] ${message}`, ...args)
    }

    /**
     * Returns true if the database should connect on boot, false otherwise.
     * 1. If onBootConnect is explicitly set to true or false in the database configuration, then return that value.
     * 2. If onBootConnect is not set in the database configuration, then return true.
     * 
     * @returns {boolean} True if the database should connect on boot, false otherwise.
     * @private
     */
    private shouldConnectOnBoot(): boolean {
        if(this.config.onBootConnect !== undefined) {
            return this.config.onBootConnect
        }

        return true
    }
    
    /**
     * Boot method
     * Called after all providers have been registered
     * Use this method to perform any actions that require other services to be available
     *
     * @returns {Promise<void>}
     */
    async boot(): Promise<void> {
        this.registerAdapters()
        this.registerConnections()
        
        if(!this.shouldConnectOnBoot()) {
            this.log('Database is not configured to connect on boot');
            return;
        }

        await this.connectDefault()
        await this.connectKeepAlive()
    }
    
    /**
     * Connects to the default database connection.
     */
    async connectDefault(): Promise<void> {
        await this.connectAdapter(this.getDefaultConnectionName())
    }

    /**
     * Connects to all keep alive connections
     */
    protected async connectKeepAlive() {
        const connections = (this.config?.keepAliveConnections ?? '').split(',');
    
        for (const connectionName of connections) {
    
            if(connectionName.length === 0) {
                continue
            }
            if(connectionName === this.config.defaultConnectionName) {
                continue
            }
    
            await this.connectAdapter(connectionName)
        }
    }

    /**
     * Connects to the adapter for a given connection name.
     * 
     * If the adapter has already been connected and registered, this method does nothing.
     * Otherwise, it creates a new instance of the adapter, connects it, and registers it for the given connection name.
     * 
     * @param connectionName The name of the connection to connect to.
     * @returns {Promise<void>}
     * @private
     */
    private async connectAdapter(connectionName: string = this.getDefaultConnectionName()): Promise<void> {
        const connectionConfig = this.getConnectionConfig(connectionName)
        const adapterCtor = this.getAdapterConstructor(connectionName)

        const adapterAlreadyDefined = this.getRegisteredByList(Database.REGISTERED_ADAPTERS_BY_CONNECTION).get(connectionName)?.[0]

        if(adapterAlreadyDefined) {
            return;
        }

        this.log('Connecting to database (Connection: ' + connectionName + ')');

        const adapter = new adapterCtor(connectionName, connectionConfig);
        await adapter.connect()
        
        this.registerByList(Database.REGISTERED_ADAPTERS_BY_CONNECTION, connectionName, adapter)
    }

    /**
     * Register adapters
     */
    private registerAdapters(): void {
        for(const connectionConfig of this.config.connections) {
            const adapterName = DatabaseAdapter.getName(connectionConfig.adapter)
            this.registerByList(Database.REGISTERED_ADAPTERS_CONFIG, adapterName, connectionConfig.adapter)
        }
    }

    /**
     * Register connections
     */
    private registerConnections(): void {
        for(const connectionConfig of this.config.connections) {
            this.registerByList(Database.REGISTERED_CONNECTIONS_CONFIG, connectionConfig.connectionName, connectionConfig)
            this.log(`Registered connection: ${connectionConfig.connectionName}`)
        }
        
    }

    /**
     * Checks if a connection is a specified provider (adapter)
     * @param adapterName 
     * @param connectionName 
     * @returns 
     */
    isConnectionAdapter(adapter: ICtor<IDatabaseAdapter>, connectionName: string = this.getDefaultConnectionName()): boolean {
        const connectionConfig = this.config.connections.find(connectionConfig => connectionConfig.connectionName === connectionName)

        if(!connectionConfig) {
            throw new DatabaseConnectionException('Connection not found: ' + connectionName)
        }

        return DatabaseAdapter.getName(connectionConfig.adapter) === DatabaseAdapter.getName(adapter)
    }
    
    /**
     * Get the default connection name
     * @returns 
     */
    getDefaultConnectionName(): string {
        return this.overrideDefaultConnectionName ?? this.config.defaultConnectionName
    }

    /**
     * Set the default connection name
     * @param name 
     */
    setDefaultConnectionName(name: string | null) {
        this.overrideDefaultConnectionName = name ?? undefined
    }

    /**
     * Retrieves the connection configuration for a specified connection name.
     * 
     * @template T - The type of the connection configuration object.
     * @param {string} connectionName - The name of the connection to retrieve the configuration for.
     * @returns {IDatabaseGenericConnectionConfig<T>} The configuration object for the specified connection.
     * @throws {Error} If the connection is not found.
     */
    getConnectionConfig<T extends object = object>(connectionName: string): IDatabaseGenericConnectionConfig<T> {
        const connectionConfig: IDatabaseGenericConnectionConfig = this.getRegisteredByList(Database.REGISTERED_CONNECTIONS_CONFIG).get(connectionName)?.[0]

        if(!connectionConfig) {
            throw new Error('Connection not found: ' + connectionName)
        }

        return connectionConfig as IDatabaseGenericConnectionConfig<T>
    }

    /**
     * Get the adapter constructor for the given connection name.
     * 
     * @param connectionName The name of the connection to get the adapter for.
     * @returns The constructor for the adapter.
     * @throws {Error} If the connection or adapter is not registered.
     */
    getAdapterConstructor<T extends ICtor<IDatabaseAdapter> = ICtor<IDatabaseAdapter>>(connectionName: string = this.getDefaultConnectionName()): T {
        const connectionConfig = this.config.connections.find(connectionConfig => connectionConfig.connectionName === connectionName)

        if(!connectionConfig) {
            throw new Error('Connection not found: ' + connectionName)
        }

        return connectionConfig.adapter as T
    }

    /**
     * Get the adapter for the given connection name.
     * 
     * @param connectionName The name of the connection to get the adapter for.
     * @returns The adapter instance for the given connection.
     * @throws {Error} If the connection or adapter is not registered.
     */
    getAdapter<TAdapter extends IDatabaseAdapter = IDatabaseAdapter>(connectionName: string = this.getDefaultConnectionName()): TAdapter {
        const adapter = this.getRegisteredByList(Database.REGISTERED_ADAPTERS_BY_CONNECTION).get(connectionName)?.[0]

        if(!adapter) {
            throw new Error('Adapter not found: ' + connectionName)
        }

        return adapter as TAdapter
    }

    /**
     * Retrieves all registered database adapters.
     *
     * @returns {IDatabaseAdapter[]} An array of all registered database adapter instances.
     */
    getAllAdapterConstructors(): ICtor<IDatabaseAdapter>[] {
        return this.config.connections.map((connectionConfig) => connectionConfig.adapter)
    }

    /**
     * Get the default credentials for a given adapter name.
     * 
     * The default credentials are retrieved from the adapter's `getDefaultCredentials` method.
     * 
     * @param adapterName The name of the adapter to get the default credentials for.
     * @returns The default credentials for the adapter, or null if they could not be retrieved.
     */
    getDefaultCredentials(adapterName: string): string | null {
        const adapterCtor = this.getAdapterConstructor(adapterName)
        const adapter = new adapterCtor('', {})
        return adapter.getDefaultCredentials()
    }

    /**
     * Get the DocumentManager service
     * 
     * @param connectionName 
     * @returns 
     */
    documentManager<TDocMan extends IDocumentManager = IDocumentManager>(connectionName: string = this.getDefaultConnectionName()): TDocMan {
        return this.getAdapter(connectionName).getDocumentManager() as TDocMan
    }
    
    /**
         * Get the schema service
         * 
         * @param connectionName 
         * @returns 
         */
    schema<TSchema extends IDatabaseSchema = IDatabaseSchema>(connectionName: string = this.getDefaultConnectionName()): TSchema {
        return this.getAdapter(connectionName).getSchema() as TSchema
    }
    
    /**
     * Get the database raw client
     * Example
     *  getClient() // MongoClient
     * 
     * @returns 
     */
    getClient<T = unknown>(connectionName: string = this.getDefaultConnectionName()): T {
        return this.getAdapter(connectionName).getClient() as T
    }

    /**
     * Creates the migrations schema for the database
     * @param tableName The name of the table to create
     * @param connectionName The connection name to use for the migration schema
     * @returns A promise that resolves when the schema has been created
     */
    async createMigrationSchema(tableName: string, connectionName: string = this.getDefaultConnectionName()): Promise<unknown> {
        return await this.getAdapter(connectionName).createMigrationSchema(tableName)
    }

}

export default Database