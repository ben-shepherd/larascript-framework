import { IUserData } from "@src/core/domains/auth/interfaces/IUserModel";
import hashPassword from "@src/core/domains/auth/utils/hashPassword";
import Observer from "@src/core/domains/observer/services/Observer";

/**
 * Observer for the User model.
 * 
 * Automatically hashes the password on create/update if it is provided.
 */
export default class UserObserver extends Observer<IUserData> {

    /**
     * Called when the User model is being created.
     * Automatically hashes the password if it is provided.
     * @param data The User data being created.
     * @returns The processed User data.
     */
    creating(data: IUserData): IUserData {
        data = this.onPasswordChange(data)
        return data
    }

    /**
     * Automatically hashes the password if it is provided.
     * @param data The User data being created/updated.
     * @returns The processed User data.
     */
    onPasswordChange(data: IUserData): IUserData {
        if(!data.password) {
            return data
        }
        
        data.hashedPassword = hashPassword(data.password);
        delete data.password;

        return data
    }

}
