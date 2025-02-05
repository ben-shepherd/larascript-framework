/* eslint-disable no-unused-vars */
import { IUserModel } from "../models/IUserModel";

export interface IUserRepository {
    findById(id: string | number): Promise<IUserModel | null>
    findByEmail(email: string): Promise<IUserModel | null>
}