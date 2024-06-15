import { IModel } from "@src/core/interfaces/IModel";
import { IRepository } from "@src/core/interfaces/IRepository";
import BaseUserModel from "../models/BaseUserModel";

export default interface IUserRepository<M extends IModel = BaseUserModel> extends IRepository<M> 
{
    findByEmail(email: string): Promise<M | null>
}