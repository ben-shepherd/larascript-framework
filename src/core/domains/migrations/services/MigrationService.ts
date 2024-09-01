import { App } from "@src/core/services/App";
import { MongoClient } from "mongodb";
import MigrationFactory from "@src/core/domains/migrations/factory/MigrationFactory";
import { IMigrationService, IMigrationServiceOptions } from "@src/core/domains/migrations/interfaces/IMigrationService";
import MigrationRepository from "@src/core/domains/migrations/repository/MigrationRepository";
import MigrationFileService from "@src/core/domains/migrations/services/MigrationFilesService";

class MigrationService implements IMigrationService {
    private fileService: MigrationFileService = new MigrationFileService();
    private repository: MigrationRepository = new MigrationRepository();

    async boot()
    {
        // Create the migrations schema
        await this.createSchema();
    }

    /**
     * Run the migrations up
     * @param options 
     */
    async up({ filterByFileName }: Pick<IMigrationServiceOptions, 'filterByFileName'>): Promise<void> {

        // Get the migration file names
        const migrationFileNames = await this.fileService.getMigrationFileNames();

        // Sort from oldest to newest
        migrationFileNames.sort((a, b) => {
            const aDate = this.fileService.parseDate(a);
            const bDate = this.fileService.parseDate(b);

            if(!aDate || !bDate) {
                return 0;
            }

            return aDate.getTime() - bDate.getTime();
        })

        // Get the current batch count
        const newBatchCount = (await this.getCurrentBatchCount()) + 1;

        // Run the migrations for every file
        for (const fileName of migrationFileNames) {

            // Check if the file should be skipped
            if (filterByFileName && fileName !== filterByFileName) {
                continue;
            }

            console.log(`[Migration] up -> ${fileName}`);
            await this.handleFile(fileName, newBatchCount);
        }
    }

    /**
     * Run the migrations down
     */
    async down({ batch }: Pick<IMigrationServiceOptions, 'batch'>): Promise<void> 
    {
        // Get the current batch count
        const batchCount = batch ?? await this.getCurrentBatchCount();    

        // Get the migration results
        const results = await this.getMigrationResults({
            batch: batchCount
        });

        // Sort by oldest to newest
        results.sort((a, b) => {
            const aDate = a.getAttribute('appliedAt') as Date;
            const bDate = b.getAttribute('appliedAt') as Date;

            if(!aDate || !bDate) {
                return 0;
            }

            return aDate.getTime() - bDate.getTime();
        });

        // Run the migrations
        for(const result of results) {
            const fileName = result.getAttribute('name') as string;
            const migration = await this.fileService.getImportMigrationClass(fileName);

            // Run the down method
            console.log(`[Migration] down -> ${fileName}`);
            await migration.down();

            // Delete the migration document
            await result.delete();
        }
    }

    /**
     * Handle a migration file
     * @param fileName 
     * @param newBatchCount 
     * @returns 
     */
    async handleFile(fileName: string, newBatchCount: number): Promise<void> {
        const fileChecksum = await this.fileService.checksum(fileName);

        const migrationDocument = await this.repository.findOne({
            name: fileName,
            checksum: fileChecksum
        });

        if (migrationDocument) {
            console.log(`[Migration] ${fileName} already applied`);
            return;
        }

        const migration = await this.fileService.getImportMigrationClass(fileName);
        await migration.up();

        const model = (new MigrationFactory).create({
            name: fileName,
            batch: newBatchCount,
            checksum: fileChecksum,
            appliedAt: new Date(),
        })
        await model.save();
    }

    /**
     * Get the current batch count
     * @returns 
     */
    protected async getCurrentBatchCount(): Promise<number> {
        const results = await this.repository.findMany({});

        let current = 0;

        results.forEach(result => {
            if (result.getAttribute('batch') as number > current) {
                current = result.getAttribute('batch') as number
            }
        });

        return current;
    }

    /**
     * Get the migration results
     * @returns 
     */
    protected async getMigrationResults(filters?: object) {
        return await (new MigrationRepository).findMany({
            ...(filters ?? {})
        })
    }


    /**
     * Create the migrations schema
     * @returns 
     */
    protected async createSchema(): Promise<void> {
        try {
            /**
             * Handle MongoDB driver
             */
            if (App.container('db').isDriver('mongodb')) {
                const client = App.container('db').getClient<MongoClient>();
                const db = client.db();

                if (await db.listCollections({ name: 'migrations' }).hasNext()) {
                    return;
                }

                await db.createCollection('migrations');
            }
        }
        catch (err) {
            console.log('[Migration] createSchema', err)

            if (err instanceof Error) {
                console.error(err)
            }
        }
    }
}

export default MigrationService