import { ICtor } from "@src/core/interfaces/ICtor";

import { IDatabaseAdapterConfig } from "../interfaces/IDatabaseConfig";


class DatabaseAdapter {

    /**
     * Returns the name of the adapter, which is the name of the constructor.
     * This is used to register adapters and to identify them in the config.
     * @param adapter The adapter to get the name of.
     * @returns The name of the adapter.
     */
    public static getName(adapter: ICtor<DatabaseAdapter>) {
        return adapter.name
    }

    /**
     * Creates an adapter config object with the 'name' property automatically set to the name of the adapter constructor.
     * This is a convenience method to create adapter config objects without having to manually set the 'name' property.
     * @param config The adapter config object to create, with the 'name' property set to undefined.
     * @returns The created adapter config object with the 'name' property set to the name of the adapter constructor.
     */
    public static createAdapter(config: Omit<IDatabaseAdapterConfig, 'name'>): IDatabaseAdapterConfig {
        return {
            ...config,
            name: DatabaseAdapter.getName(config.adapter)
        }
    }

}

export default DatabaseAdapter