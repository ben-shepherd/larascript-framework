import BaseCommand from "@src/core/domains/console/base/BaseCommand";
import MigrationService from "@src/core/domains/migrations/services/MigrationService";

class MigrateUpCommand extends BaseCommand
{
    public signature: string = 'migrate:up';

    execute = async () =>
    {
        const file = this.getArguementByKey('file')?.value;
        const service = new MigrationService();
        await service.boot();
        await service.up({ filterByFileName: file });
    }
}

export default MigrateUpCommand