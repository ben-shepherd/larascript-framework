import BaseMakeFileCommand from "@src/core/domains/make/base/BaseMakeFileCommand";
import MigrationFileService from "@src/core/domains/migrations/services/MigrationFilesService";

export default class MakeSeederCommand extends BaseMakeFileCommand {

    constructor() {
        super({
            signature: 'make:seeder',
            description: 'Creates a new database seeder',
            makeType: 'Seeder',
            args: ['name'],
            endsWith: 'Seeder',
            customFilename: (name: string) => {
                return (new MigrationFileService).createDateFilename(name)
            }
        })
    }

}