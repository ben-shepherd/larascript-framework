import { IRepository } from "@src/core/interfaces/IRepository";
import IUserModel from "./IUserModel";

export default interface IUserRepository<Model extends IUserModel = IUserModel> extends IRepository<Model> 
{
    findOneByEmail(email: string): Promise<Model | null>
}