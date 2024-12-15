import EventWorkerException from "@src/core/domains/events/exceptions/EventWorkerException";
import { TISerializablePayload } from "@src/core/domains/events/interfaces/IEventPayload";
import { IEventWorkerConcern, IWorkerModel, TEventWorkerOptions } from "@src/core/domains/events/interfaces/IEventWorkerConcern";
import { ICtor } from "@src/core/interfaces/ICtor";
import { App } from "@src/core/services/App";
import { queryBuilder } from "@src/core/domains/eloquent/services/EloquentQueryBuilderService";

const EventWorkerConcern = (Base: ICtor) => {
    return class EventWorkerConcern extends Base implements IEventWorkerConcern {

        /**
         * Run the worker to process queued event items
         *
         * Fetches documents from the worker model repository and runs each
         * document through the handleWorkerModel method. This method is
         * responsible for processing the event contained in the document.
         *
         * @param options The options to use when running the worker
         * @returns A promise that resolves once the worker has finished
         *          processing the documents.
         */
        async runWorker(options: TEventWorkerOptions): Promise<void> {

            const workerModels = await this.fetchWorkerModelDocuments(options)

            App.container('logger').console('Queued items: ', workerModels.length)

            if(workerModels.length === 0) {
                App.container('logger').console("No queued items");
                return;
            }

            for(const workerModel of workerModels) {
                await this.handleWorkerModel(workerModel, options)
            }
        }

        /**
         * Handles a single worker model document
         * @param workerModel The worker model document to process
         * @param options The options to use when processing the event
         * @private
         */
        private async handleWorkerModel(workerModel: IWorkerModel, options: TEventWorkerOptions): Promise<void> {
            try {
                const eventName = workerModel.getAttributeSync('eventName');
            
                if(typeof eventName !== 'string') {
                    throw new EventWorkerException('Event name must be a string');
                }

                const eventCtor = App.container('events').getEventCtorByName(eventName)

                if(!eventCtor) {
                    throw new EventWorkerException(`Event '${eventName}' not found`);
                }

                const payload = workerModel.getPayload<TISerializablePayload | null>()
                
                const eventInstance = new eventCtor(payload);
                await eventInstance.execute();

                await workerModel.delete();
            }
            catch (err) {
                App.container('logger').error(err)
                await this.handleUpdateWorkerModelAttempts(workerModel, options)
            }
        }
         
        /**
         * Handles updating the worker model document with the number of attempts
         * it has made to process the event.
         * @param workerModel The worker model document to update
         * @param options The options to use when updating the worker model document
         * @private
         */
        private async handleUpdateWorkerModelAttempts(workerModel: IWorkerModel, options: TEventWorkerOptions) {

            const attempt = await workerModel.getAttributeSync('attempt') ?? 0
            const newAttempt = attempt + 1
            const retries = await workerModel.getAttributeSync('retries') ?? 0

            await workerModel.attr('attempt', newAttempt)

            if(newAttempt >= retries) {
                await this.handleFailedWorkerModel(workerModel, options)
                return;
            }

            await workerModel.save();
        }

        /**
         * Handles a worker model that has failed to process.
         *
         * Saves a new instance of the failed worker model to the database
         * and deletes the original worker model document.
         *
         * @param workerModel The worker model document to handle
         * @param options The options to use when handling the failed worker model
         * @private
         */
        private async handleFailedWorkerModel(workerModel: IWorkerModel, options: TEventWorkerOptions) {
            const FailedWorkerModel = new options.failedWorkerModelCtor({
                eventName: workerModel.getAttributeSync('eventName'),
                queueName: workerModel.getAttributeSync('queueName'),
                payload: workerModel.getAttributeSync('payload') ?? '{}',
                error: '',
                failedAt: new Date()
            })
            await FailedWorkerModel.save();
            await workerModel.delete();
        }
    
        /**
         * Fetches worker model documents
         */
        private async fetchWorkerModelDocuments(options: TEventWorkerOptions): Promise<IWorkerModel[]> {
            return (
                await queryBuilder(options.workerModelCtor)
                    .where('queueName', options.queueName)
                    .orderBy('createdAt', 'asc')
                    .get()
            ).toArray()
        }
    
    }
}

export default EventWorkerConcern