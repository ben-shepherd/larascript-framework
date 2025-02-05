/* eslint-disable no-unused-vars */
import { IUserModel } from "@src/core/domains/auth/interfaces/models/IUserModel";

export interface IUserRepository {
    create(attributes?: IUserModel): IUserModel
    findById(id: string | number): Promise<IUserModel | null>
    findByIdOrFail(id: string | number): Promise<IUserModel>
    findByEmail(email: string): Promise<IUserModel | null>
}