import BaseCommand from "@src/core/domains/console/base/BaseCommand";
import { AppSingleton } from "@src/core/services/App";

export default class RouteListCommand extends BaseCommand {

    signature: string = 'route:list';

    description = 'List all available routes. Use --details to see more information.';

    public keepProcessAlive = false;

    /**
     * Execute the command
     */
    async execute() {
        const showDetails = this.parsedArgumenets.find(arg => ['--details', '--d', '--detailed'].includes(arg.value));
        const httpService = AppSingleton.container('http')


        this.input.clearScreen();
        this.input.writeLine('--- Available Routes ---');
        this.input.writeLine();

        httpService.getRegisteredRoutes().forEach(route => {
            if (showDetails) {
                this.input.writeLine(`Path: ${route.path}`);
                this.input.writeLine(`  Name: ${route.name}`);
                this.input.writeLine(`  Method: ${route.method}`);
                this.input.writeLine(`  Action: ${route.action}`);

                this.input.writeLine(`  Security: [${route.security?.map(s => s.getId()).join(', ')}]`);
                this.input.writeLine();
                return;
            }

            this.input.writeLine(`- ${route.path}`);
        })
    }

}