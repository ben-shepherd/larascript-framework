import { IModel } from "@src/core/interfaces/IModel";
import { IRepository } from "@src/core/interfaces/IRepository";
import BaseUserModel from "../models/BaseUserModel";

export default interface IUserRepository<Model extends IModel = BaseUserModel> extends IRepository<Model> 
{
    findOneByEmail(email: string): Promise<Model | null>
}