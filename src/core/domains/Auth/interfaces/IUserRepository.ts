import { IRepository } from "@src/core/interfaces/IRepository";
import IUserModel from "./IUserModel";

export default interface IUserRepository extends IRepository<IUserModel> 
{
    findOneByEmail(email: string): Promise<IUserModel | null>
}