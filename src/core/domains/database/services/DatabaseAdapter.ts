import { IDatabaseAdapter, TAdapterComposerFileName } from "@src/core/domains/database/interfaces/IDatabaseAdapter";
import { TClassConstructor } from "@src/core/interfaces/ClassConstructor.t";
import { app } from "@src/core/services/App";

class DatabaseAdapter {

    /**
     * Returns the name of the adapter, which is the name of the constructor.
     * This is used to register adapters and to identify them in the config.
     * @param adapter The adapter to get the name of.
     * @returns The name of the adapter.
     */
    public static getName(adapter: TClassConstructor<DatabaseAdapter>) {
        return adapter.name
    }


    /**
     * Retrieves a list of composer file names from all registered database adapters.
     *
     * @returns An array of objects, each containing:
     *  - fullName: The full composer file name (e.g., 'docker-compose.mongodb.yml').
     *  - shortName: The shortened composer file name without the extension (e.g., 'mongodb').
     */
    public static getComposerFileNames(): TAdapterComposerFileName[] {
        const db = app('db');
        const adapterCtors = db.getAllAdapterConstructors();
        const adapters = adapterCtors.map((adapterCtor: TClassConstructor<IDatabaseAdapter>) => new adapterCtor('', {}));
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