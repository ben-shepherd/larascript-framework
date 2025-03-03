import { IModel } from "@src/core/domains/models/interfaces/IModel";
import { TClassConstructor } from "@src/core/interfaces/ClassConstructor.t";

export interface IQueableDriverOptions {
    queueName: string;
    retries: number;
    failedCollection: string;
    runAfterSeconds: number;
    workerModelCtor: TClassConstructor<IModel>;
}