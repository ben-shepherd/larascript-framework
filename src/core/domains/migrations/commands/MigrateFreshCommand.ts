
import { App } from "@src/core/services/App";

import BaseMigrationCommand from "../base/BaseMigrationCommand";

/**
 * MigrateFresh class handles running fresh migrations
 */
class MigrateFreshCommand extends BaseMigrationCommand {

    /**
     * The signature of the command
     */
    public signature: string = 'migrate:fresh';

    description = 'Drops all tables and runs fresh migrations';


    /**
     * Execute the command
     */
    async execute() {
        if(!await this.confirm()) {
            return;
        }

        // Get the db schema helper
        const schema = App.container('db').schema();

        // Drop all tables
        await schema.dropAllTables();

        // Handle migrate:up
        const console = App.container('console');
        await console.reader(['migrate:up']).handle();
    }

    private async confirm(): Promise<boolean> {
        this.input.writeLine('--- Confirm Action ---');
        const answer = await this.input.askQuestion('Are you sure you want to drop all tables and run fresh migrations? (y/n)');
        return answer === 'y';

    }

}

export default MigrateFreshCommand
