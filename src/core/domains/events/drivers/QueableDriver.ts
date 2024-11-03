import BaseDriver from "@src/core/domains/events/base/BaseDriver";
import { ICtor } from "@src/core/interfaces/ICtor";
import { IModel } from "@src/core/interfaces/IModel";
import { z } from "zod";

import EventDriverException from "../exceptions/EventDriverException";
import { IBaseEvent } from "../interfaces/IBaseEvent";
import { IWorkerModel, TFailedWorkerModelData } from "../interfaces/IEventWorkerConcern";


export type TQueueDriverOptions = {

    /**
     * Name of the queue
     */
    queueName: string;

    /**
     * Name of the event, defaults to the IEvent.name
     */
    eventName?: string;

    /**
     * Number of retry attempts for failed events
     */
    retries: number;

    /**
     * Delay before processing queued events
     */
    runAfterSeconds: number;

    /**
     * Constructor for the Worker model
     */
    workerModelCtor: ICtor<IWorkerModel>;

    /**
     * Constructor for the Worker model for failed events
     */
    failedWorkerModelCtor: ICtor<IModel<TFailedWorkerModelData>>;

    /**
     * Run the worker only once, defaults to false
     */
    runOnce?: boolean;
}

class QueueableDriver extends BaseDriver  {

    /**
     * Dispatches an event by saving it to the worker model.
     *
     * First, it retrieves the options for the queue driver using the getOptions method.
     * Then, it validates the options using the validateOptions method.
     * If the options are invalid, it throws an EventDriverException.
     * Finally, it creates a new instance of the worker model using the options.workerModelCtor,
     * and saves it to the database.
     *
     * @param event The event to dispatch.
     * @throws {EventDriverException} If the options are invalid.
     * @returns A promise that resolves once the event has been dispatched.
     */
    async dispatch(event: IBaseEvent): Promise<void> {

        const options = this.getOptions<TQueueDriverOptions>()

        this.validateOptions(options)

        await this.updateWorkerQueueTable(options as TQueueDriverOptions, event)
    }

    /**
     * Updates the worker queue table with the given event.
     *
     * It creates a new instance of the worker model using the options.workerModelCtor,
     * and saves it to the database. This method is used by the dispatch method to
     * save the event to the worker queue table.
     *
     * @param options The options to use when updating the worker queue table.
     * @param event The event to update the worker queue table with.
     * @returns A promise that resolves once the worker queue table has been updated.
     * @throws {EventDriverException} If the options are invalid.
     */
    private async updateWorkerQueueTable(options: TQueueDriverOptions, event: IBaseEvent) {
        const workerModel = new options.workerModelCtor({
            queueName: event.getQueueName(),
            eventName: event.getName(),
            retries: options.retries,
            payload: JSON.stringify(event.getPayload() ?? {}),
        })
        await workerModel.save();
    }

    /**
     * Validates the options for the queue driver
     * @param options The options to validate
     * @throws {EventDriverException} If the options are invalid
     * @private
     */
    private validateOptions(options: TQueueDriverOptions | undefined) {
        const schema = z.object({
            queueName: z.string(),
            eventName: z.string().optional(),
            retries: z.number(),
            runAfterSeconds: z.number(),
            workerModelCtor: z.any(),
            failedWorkerModelCtor: z.any(),
            runOnce: z.boolean().optional()
        })

        const parsedResult = schema.safeParse(options)

        if(!parsedResult.success) {
            throw new EventDriverException('Invalid queue driver options: '+ parsedResult.error.message);
        }
    }

}

export default QueueableDriver