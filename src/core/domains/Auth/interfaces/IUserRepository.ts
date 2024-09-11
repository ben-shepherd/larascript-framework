/* eslint-disable no-unused-vars */
import IUserModel from "@src/core/domains/auth/interfaces/IUserModel";
import { IRepository } from "@src/core/interfaces/IRepository";

export default interface IUserRepository extends IRepository<IUserModel> 
{
    findOneByEmail(email: string): Promise<IUserModel | null>
}