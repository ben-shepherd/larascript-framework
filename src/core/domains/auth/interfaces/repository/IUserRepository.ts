/* eslint-disable no-unused-vars */
import { IUserModel } from "../models/IUserModel";

export interface IUserRepository {
    create(attributes?: IUserModel): IUserModel
    findById(id: string | number): Promise<IUserModel | null>
    findByIdOrFail(id: string | number): Promise<IUserModel>
    findByEmail(email: string): Promise<IUserModel | null>
}