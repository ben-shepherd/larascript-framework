/* eslint-disable no-unused-vars */
import IApiTokenModel from "@src/core/domains/auth/interfaces/IApitokenModel";
import { IRepository } from "@src/core/interfaces/IRepository";

export default interface IApiTokenRepository extends IRepository<IApiTokenModel> {
    findOneToken(...args: any[]): Promise<IApiTokenModel | null>;
    findOneActiveToken(...args: any[]): Promise<IApiTokenModel | null>;
}