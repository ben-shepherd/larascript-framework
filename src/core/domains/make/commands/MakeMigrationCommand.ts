import BaseMakeFileCommand from "@src/core/domains/make/base/BaseMakeFileCommand";
import MigrationFileService from "@src/core/domains/migrations/services/MigrationFilesService";

export default class MakeMigrationCommand extends BaseMakeFileCommand
{
    constructor() {
        super({
            signature: 'make:migration',
            description: 'Create a new migration',
            makeType: 'Migration',
            args: ['name'],
            customFilename: (name: string) => {
                return (new MigrationFileService).createDateFilename(name)
            }
        })
    }
}