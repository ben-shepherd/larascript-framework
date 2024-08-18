import { IRepository } from "@src/core/interfaces/IRepository";
import IApiTokenModel from "./IApitokenModel";

export default interface IApiTokenRepository extends IRepository<IApiTokenModel> {
    findOneToken(...args: any[]): Promise<IApiTokenModel | null>;
    findOneActiveToken(...args: any[]): Promise<IApiTokenModel | null>;
}