import BaseApiTokenModel from "@src/core/domains/auth/models/BaseApiTokenModel";
import { IRepository } from "@src/core/interfaces/IRepository";

export default interface IApiTokenRepository<Model extends BaseApiTokenModel = BaseApiTokenModel> extends IRepository<Model>{
    findOneToken(...args: any[]): Promise<Model | null>;
    findOneActiveToken(...args: any[]): Promise<Model | null>;
}