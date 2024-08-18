import IData from "@src/core/interfaces/IData";
import { IModel } from "@src/core/interfaces/IModel";

export default interface IApiTokenModel<D extends IData = IData> extends IModel<D> {
    user(): Promise<any>;
}