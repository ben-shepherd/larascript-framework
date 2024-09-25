import BaseCommand from "@src/core/domains/console/base/BaseCommand";
import { App } from "@src/core/services/App";

export default class ListRoutesCommand extends BaseCommand {

    signature: string = 'list:routes';

    description = 'List all available routes. Use --details to see more information.';

    public keepProcessAlive = false;

    /**
     * Execute the command
     */
    async execute() {
        const showDetails = this.parsedArgumenets.find(arg => ['--details', '--d', '--detailed'].includes(arg.value));
        const expressService = App.container('express')

        this.input.clearScreen();
        this.input.writeLine('--- Available Routes ---');
        this.input.writeLine();

        expressService.getRoutes().forEach(route => {
            if (showDetails) {
                this.input.writeLine(`Path: ${route.path}`);
                this.input.writeLine(`  Name: ${route.name}`);
                this.input.writeLine(`  Method: ${route.method}`);
                this.input.writeLine(`  Action: ${route.action.name}`);
                this.input.writeLine(`  Middleware: [${route.middlewares?.map(m => m.name).join(', ') ?? ''}]`);
                this.input.writeLine(`  Validators: [${route.validator?.name ?? ''}]`);
                this.input.writeLine(`  Scopes: [${route.scopes?.join(', ') ?? ''}]`);
                this.input.writeLine(`  Security: [${route.security?.map(s => s.id).join(', ')}]`);
                this.input.writeLine();
                return;
            }

            this.input.writeLine(`- ${route.path}`);
        })
    }

}