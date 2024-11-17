import { IDatabaseAdapter, TAdapterComposerFileName } from "@src/core/domains/database/interfaces/IDatabaseAdapter";
import { IDatabaseAdapterConfig } from "@src/core/domains/database/interfaces/IDatabaseConfig";
import { ICtor } from "@src/core/interfaces/ICtor";
import { App } from "@src/core/services/App";

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
     * Creates an adapter configuration object from the given adapter constructor.
     * @param adapter The adapter constructor to create the configuration object from.
     * @returns An adapter configuration object containing the adapter and its name.
     */
    public static createAdapterConfig(adapter: ICtor<IDatabaseAdapter>): IDatabaseAdapterConfig {
        return {
            adapter,
            name: DatabaseAdapter.getName(adapter),
        }
    }
    
    /**
     * Retrieves a list of composer file names from all registered database adapters.
     *
     * @returns An array of objects, each containing:
     *  - fullName: The full composer file name (e.g., 'docker-compose.mongodb.yml').
     *  - shortName: The shortened composer file name without the extension (e.g., 'mongodb').
     */
    public static getComposerFileNames(): TAdapterComposerFileName[] {
        const db = App.container('db');
        const adapterCtors = db.getAllAdapterConstructors();
        const adapters = adapterCtors.map((adapterCtor: ICtor<IDatabaseAdapter>) => new adapterCtor('', {}));
        const composerFileNames = adapters.map((adapter: IDatabaseAdapter) => adapter.getDockerComposeFileName());

        const lastPartRegex = RegExp(/docker-compose.(\w+).yml$/);

        return composerFileNames.map((composerFileName: string) => ({
            fullName: composerFileName,
            shortName: composerFileName.replace(lastPartRegex, '$1')
        }));
    }

    /**
     * Retrieves an array of short composer file names (e.g., ['mongodb', 'postgres'])
     * @returns {string[]}
     */
    public static getComposerShortFileNames(): string[] {
        return this.getComposerFileNames()
            .map((composerFileName: TAdapterComposerFileName) => composerFileName.shortName);
    }

}

export default DatabaseAdapter