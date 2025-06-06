import { EVENT_DRIVERS } from "@src/config/events.config";
import BaseCommand from "@src/core/domains/console/base/BaseCommand";
import { IEventDriversConfigOption } from "@src/core/domains/events/interfaces/config/IEventDriversConfig";
import { IEventService } from "@src/core/domains/events/interfaces/IEventService";
import { TEventWorkerOptions } from "@src/core/domains/events/interfaces/IEventWorkerConcern";
import { AppSingleton } from "@src/core/services/App";
import { z } from "zod";

export default class WorkerCommand extends BaseCommand {

    /**
     * The signature of the command
     */
    signature: string = 'worker';

    description = 'Run the worker to process queued event items. --queue=[queue]';

    /**
     * Whether to keep the process alive after command execution
     */
    public keepProcessAlive = true;

    protected eventService: IEventService = AppSingleton.container('events');

    /**
     * Execute the command
     */

    async execute() {
        const options = this.getWorkerOptions();

        await this.eventService.runWorker(options);

        const intervalId = setInterval(async () => {
            await this.eventService.runWorker(options);
            AppSingleton.container('logger').console('Running worker again in ' + options.runAfterSeconds + ' seconds')
        }, options.runAfterSeconds * 1000)

        if (options.runOnce) {
            clearInterval(intervalId);
            AppSingleton.container('logger').console('runOnce enabled. Quitting...');
        }
    }

    /**
     * Gets the worker options from the CLI arguments or the default value.
     * @returns The worker options.
     */
    private getWorkerOptions(): TEventWorkerOptions {
        const driverName = this.getArguementByKey('driver')?.value ?? EVENT_DRIVERS.QUEABLE;
        const queueName = this.getArguementByKey('queue')?.value ?? 'default';

        const options = this.eventService.getDriverOptionsByName(driverName)?.options;

        this.validateOptions(driverName, options);

        return { ...options, queueName } as TEventWorkerOptions;
    }

    /**
     * Validates the options for the worker
     * @param driverName The name of the driver
     * @param options The options to validate
     * @throws {Error} If the options are invalid
     * @private
     */
    private validateOptions(driverName: string, options: IEventDriversConfigOption['options'] | undefined) {
        if (!options) {
            throw new Error('Could not find options for driver: ' + driverName);
        }

        const schema = z.object({
            retries: z.number(),
            runAfterSeconds: z.number(),
            runOnce: z.boolean().optional(),
            workerModelCtor: z.any(),
            failedWorkerModelCtor: z.any(),
        })

        const parsedResult = schema.safeParse(options)

        if (!parsedResult.success) {
            throw new Error('Invalid worker options: ' + parsedResult.error.message);
        }
    }

}