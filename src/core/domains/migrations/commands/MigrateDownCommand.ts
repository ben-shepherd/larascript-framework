import BaseCommand from "@src/core/domains/console/base/BaseCommand";
import MigrationService from "@src/core/domains/migrations/services/MigrationService";

class MigrateUpCommand extends BaseCommand
{
    public signature: string = 'migrate:down';

    execute = async () =>
    {
        const batch = this.getArguementByKey('batch')?.value;
        const service = new MigrationService();
        await service.boot();
        await service.down({ batch: batch ? parseInt(batch) : undefined }); 
    }
}

export default MigrateUpCommand