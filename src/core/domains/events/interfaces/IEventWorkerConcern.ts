/* eslint-disable no-unused-vars */
import { ICtor } from "@src/core/interfaces/ICtor";
import { IModel } from "@src/core/interfaces/IModel";


export type TWorkerModelData = {
    queueName: string;
    eventName: string;
    payload: any;
    attempt: number;
    retries: number;
    createdAt: Date;
}

export type TFailedWorkerModel = IModel<TFailedWorkerModelData>;

export type TFailedWorkerModelData = {
    eventName: string;
    queueName: string;
    payload: string;
    error: string;
    failedAt: Date;
}

export interface IWorkerModel extends IModel<TWorkerModelData> {
    getPayload<T = unknown>(): T | null;
}

export type TEventWorkerOptions = {
    queueName: string;
    retries: number;
    runAfterSeconds: number;
    workerModelCtor: ICtor<IWorkerModel>
    failedWorkerModelCtor: ICtor<TFailedWorkerModel>;
    runOnce?: boolean;
}

export interface IEventWorkerConcern {
    runWorker(options: TEventWorkerOptions): Promise<void>;
}