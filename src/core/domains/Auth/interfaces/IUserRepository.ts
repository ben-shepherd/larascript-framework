import BaseUserModel from "@src/core/domains/Auth/models/BaseUserModel";
import { IModel } from "@src/core/interfaces/IModel";
import { IRepository } from "@src/core/interfaces/IRepository";

export default interface IUserRepository<Model extends IModel = BaseUserModel> extends IRepository<Model> 
{
    findOneByEmail(email: string): Promise<Model | null>
}