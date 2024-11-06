import { ICtor } from "@src/core/interfaces/ICtor";
import { IModel } from "@src/core/interfaces/IModel";

export interface IQueableDriverOptions {
    queueName: string;
    retries: number;
    failedCollection: string;
    runAfterSeconds: number;
    workerModelCtor: ICtor<IModel>;
}