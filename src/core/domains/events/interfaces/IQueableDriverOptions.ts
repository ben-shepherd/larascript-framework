import { IModel } from "@src/core/domains/models/interfaces/IModel";
import { ICtor } from "@src/core/interfaces/ICtor";

export interface IQueableDriverOptions {
    queueName: string;
    retries: number;
    failedCollection: string;
    runAfterSeconds: number;
    workerModelCtor: ICtor<IModel>;
}