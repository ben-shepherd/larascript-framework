import { IRepository } from "@src/core/interfaces/IRepository";
import BaseApiTokenModel from "../models/BaseApiTokenModel";

export default interface IApiTokenRepository<Model extends BaseApiTokenModel = BaseApiTokenModel> extends IRepository<Model>{
    findByToken(...args: any[]): Promise<Model | null>;
    findByUnrevokedToken(...args: any[]): Promise<Model | null>;
}