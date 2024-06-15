import { IRepository } from "@src/core/interfaces/IRepository";
import BaseApiTokenModel from "../models/BaseApiTokenModel";

export default interface IApiTokenRepository<Model extends BaseApiTokenModel = BaseApiTokenModel> extends IRepository<Model>{
    findOneToken(...args: any[]): Promise<Model | null>;
    findOneActiveToken(...args: any[]): Promise<Model | null>;
}