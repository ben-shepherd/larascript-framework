
import { IRegsiterList, TRegisterMap } from "@src/core/interfaces/concerns/IHasRegisterableConcern";

import BaseDatabase from "../base/BaseDatabase";
import { IBaseDatabase } from "../interfaces/IBaseDatabase";
import { IDatabaseAdapter } from "../interfaces/IDatabaseAdapter";
import { IDatabaseAdapterConfig, IDatabaseGenericConnectionConfig } from "../interfaces/IDatabaseConfig";
import { IDatabaseService } from "../interfaces/IDatabaseService";


class Database extends BaseDatabase implements IDatabaseService, IBaseDatabase {

    static readonly REGISTERED_ADAPTERS = 'registeredAdapters'

    static readonly REGISTERED_CONNECTIONS = 'registeredConnections'

    /**
     * Override the default connection name (Testing purposes)
     */
    protected overrideDefaultConnectionName?: string;

    /**
     * Has registerable concern
     */
    declare register: (key: string, value: unknown) => void;
    
    declare registerByList: (listName: string, key: string, value: unknown) => void;
    
    declare setRegisteredByList: (listName: string, registered: TRegisterMap) => void;
    
    declare getRegisteredByList: <T extends TRegisterMap = TRegisterMap>(listName: string) => T;
    
    declare getRegisteredList: <T extends TRegisterMap = TRegisterMap>() => T;
    
    declare getRegisteredObject: () => IRegsiterList;
    
    declare isRegisteredInList: (listName: string, key: string) => boolean;

    /**
     * Register adapters
     */
    registerAdapter(adapterConfig: IDatabaseAdapterConfig): void {
        this.registerByList(Database.REGISTERED_ADAPTERS, adapterConfig.name, adapterConfig)
    }

    /**
     * Register connections
     */
    registerConnection(connectionCofig: IDatabaseGenericConnectionConfig): void {
        this.registerByList(Database.REGISTERED_CONNECTIONS, connectionCofig.driver, connectionCofig)
    }

    boot(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    provider<T = unknown>(connectionName?: string): T {
        return null as unknown as T;
    }

    isProvider(driver: string, connectionName?: string): boolean {
        return false
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

    getAdapter(connectionName: string = this.getDefaultConnectionName()): IDatabaseAdapter {
        return null as unknown as IDatabaseAdapter
    }

    /**
     * Get the DocumentManager service
     * 
     * @param connectionName 
     * @returns 
     */
    documentManager<T>(connectionName: string = this.config.defaultConnectionName): T {
        return this.store[connectionName].documentManager() as T;
    }
    
    /**
         * Get the schema service
         * 
         * @param connectionName 
         * @returns 
         */
    schema<T>(connectionName: string = this.config.defaultConnectionName): T {
        return this.store[connectionName].schema() as T;
    }
    
    /**
         * Get the database raw client
         * Example
         *  getClient() // MongoClient
         * 
         * @returns 
         */
    getClient<T = unknown>(connectionName: string = this.config.defaultConnectionName): T {
        return this.store[connectionName].getClient();
    }

}

export default Database