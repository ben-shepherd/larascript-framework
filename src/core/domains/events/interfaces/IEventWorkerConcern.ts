/* eslint-disable no-unused-vars */
import { IModel, IModelAttributes, ModelConstructor } from "@src/core/domains/models/interfaces/IModel";


export interface WorkerModelAttributes extends IModelAttributes {
    queueName: string;
    eventName: string;
    payload: any;
    attempt: number;
    retries: number;
    createdAt: Date;
}

export interface FailedWorkerModelAttributes extends IModelAttributes {
    eventName: string;
    queueName: string;
    payload: string;
    error: string;
    failedAt: Date;
}

export interface IWorkerModel extends IModel<WorkerModelAttributes> {
    getPayload<T = unknown>(): T | null;
}

export type TEventWorkerOptions = {
    queueName: string;
    retries: number;
    runAfterSeconds: number;
    workerModelCtor: ModelConstructor<IWorkerModel>
    failedWorkerModelCtor: ModelConstructor;
    runOnce?: boolean;
}

export interface IEventWorkerConcern {
    runWorker(options: TEventWorkerOptions): Promise<void>;
}