import Repository from "@src/core/base/Repository";
import MigrationFactory from "@src/core/domains/migrations/factory/MigrationFactory";
import { IMigration } from "@src/core/domains/migrations/interfaces/IMigration";
import { IMigrationConfig } from "@src/core/domains/migrations/interfaces/IMigrationConfig";
import { IMigrationService, IMigrationServiceOptions } from "@src/core/domains/migrations/interfaces/IMigrationService";
import MigrationModel from "@src/core/domains/migrations/models/MigrationModel";
import createMongoDBSchema from "@src/core/domains/migrations/schema/createMongoDBSchema";
import createPostgresSchema from "@src/core/domains/migrations/schema/createPostgresSchema";
import MigrationFileService from "@src/core/domains/migrations/services/MigrationFilesService";
import FileNotFoundError from "@src/core/exceptions/FileNotFoundError";
import { ModelConstructor } from "@src/core/interfaces/IModel";
import { IRepository } from "@src/core/interfaces/IRepository";
import { App } from "@src/core/services/App";

interface MigrationDetail {
    fileName: string,
    migration: IMigration
}

/**
 * MigrationService class is responsible for handling migrations.
 * It creates a MigrationRepository and a MigrationFileService.
 * It also provides methods to get the current batch count, to run up and down migrations.
 */
class MigrationService implements IMigrationService {

    private readonly fileService!: MigrationFileService;

    private readonly repository!: IRepository;

    protected config!: IMigrationConfig;

    protected modelCtor!: ModelConstructor;

    constructor(config: IMigrationConfig = {}) {
        this.config = config;
        this.fileService = new MigrationFileService(config.appMigrationsDir);
        this.modelCtor = config.modelCtor ?? MigrationModel;
        this.repository = new Repository(this.modelCtor);
    }

    async boot() {
        // Create the migrations schema
        await this.createSchema();
    }

    /**
     * Get all migration details
     * @returns A record of all migration class instances, keyed by the filename
     */
    async getMigrationDetails({ group, filterByFileName }: IMigrationServiceOptions): Promise<MigrationDetail[]> {
        const result: MigrationDetail[] = [];

        const migrationFileNames = this.fileService.getMigrationFileNames();

        for (const fileName of migrationFileNames) {
            try {
                const migration = await this.fileService.getImportMigrationClass(fileName);

                if (filterByFileName && fileName !== filterByFileName) {
                    continue;
                }

                if (group && migration.group !== group) {
                    continue;
                }

                result.push({ fileName, migration });
            }
            catch (err) {
                if (err instanceof FileNotFoundError) {
                    continue;
                }
            }
        }

        return result;
    }

    /**
     * Run the migrations up
     * @param options 
     */
    async up({ filterByFileName, group }: Omit<IMigrationServiceOptions, 'batch'>): Promise<void> {

        // Get the migration file names
        const migrationsDetails = await this.getMigrationDetails({ filterByFileName, group });

        // Sort from oldest to newest
        migrationsDetails.sort((a, b) => {
            const aDate = this.fileService.parseDate(a.fileName);
            const bDate = this.fileService.parseDate(b.fileName);

            if (!aDate || !bDate) {
                return 0;
            }

            return aDate.getTime() - bDate.getTime();
        })

        // Get the current batch count
        const newBatchCount = (await this.getCurrentBatchCount()) + 1;

        if (!migrationsDetails.length) {
            console.log('[Migration] No migrations to run');
        }

        // Run the migrations for every file
        for (const migrationDetail of migrationsDetails) {
            console.log('[Migration] up -> ' + migrationDetail.fileName);

            await this.handleFileUp(migrationDetail, newBatchCount);
        }
    }

    /**
     * Run the migrations down
     */
    async down({ batch }: Pick<IMigrationServiceOptions, 'batch'>): Promise<void> {
        // Get the current batch count
        let batchCount = typeof batch !== 'undefined' ? batch : await this.getCurrentBatchCount();
        batchCount = isNaN(batchCount) ? 1 : batchCount;

        // Get the migration results
        const results = await this.getMigrationResults({
            batch: batchCount
        });

        // Sort by oldest to newest
        results.sort((a, b) => {
            const aDate = a.getAttribute('appliedAt') as Date;
            const bDate = b.getAttribute('appliedAt') as Date;

            if (!aDate || !bDate) {
                return 0;
            }

            return aDate.getTime() - bDate.getTime();
        });

        if (!results.length) {
            console.log('[Migration] No migrations to run');
        }

        // Run the migrations
        for (const result of results) {
            try {
                const fileName = result.getAttribute('name') as string;
                const migration = await this.fileService.getImportMigrationClass(fileName);

                // Run the down method
                console.log(`[Migration] down -> ${fileName}`);
                await migration.down();

                // Delete the migration document
                await result.delete();
            }
            catch (err) {
                if (err instanceof FileNotFoundError) {
                    continue;
                }
            }
        }
    }

    /**
     * Handle a migration file
     * @param fileName 
     * @param newBatchCount 
     * @returns 
     */
    async handleFileUp(migrationDetail: MigrationDetail, newBatchCount: number): Promise<void> {
        const { fileName, migration } = migrationDetail

        const fileChecksum = await this.fileService.checksum(fileName);

        const migrationDocument = await this.repository.findOne({
            name: fileName,
            checksum: fileChecksum
        });

        if (migrationDocument) {
            console.log(`[Migration] ${fileName} already applied`);
            return;
        }

        if (!migration.shouldUp()) {
            console.log(`[Migration] Skipping (Provider mismatch) -> ${fileName}`);
            return;
        }

        console.log(`[Migration] up -> ${fileName}`);
        await migration.up();

        const model = (new MigrationFactory).create({
            name: fileName,
            batch: newBatchCount,
            checksum: fileChecksum,
            appliedAt: new Date(),
        }, this.modelCtor)
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
        return await this.repository.findMany({
            ...(filters ?? {})
        })
    }

    /**
     * Create the migrations schema
     * @returns 
     */
    protected async createSchema(): Promise<void> {
        try {
            const tableName = (new this.modelCtor).table

            /**
             * Handle MongoDB driver
             */
            if (App.container('db').isProvider('mongodb')) {
                await createMongoDBSchema(tableName);
            }

            /**
             * Handle Postgres driver
             */
            if (App.container('db').isProvider('postgres')) {
                await createPostgresSchema(tableName);
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