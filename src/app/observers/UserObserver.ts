import { IUserData } from "@src/app/models/auth/User";
import hashPassword from "@src/core/domains/auth/utils/hashPassword";
import Observer from "@src/core/domains/observer/services/Observer";
import { App } from "@src/core/services/App";

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
    async creating(data: IUserData): Promise<IUserData> {
        data = this.onPasswordChange(data)
        data = await this.updateRoles(data)
        return data
    }

    /**
     * Updates the roles of the user based on the groups they belong to.
     * Retrieves the roles associated with each group the user belongs to from the permissions configuration.
     * @param data The User data being created/updated.
     * @returns The processed User data with the updated roles.
     */
    async updateRoles(data: IUserData): Promise<IUserData> {
        let updatedRoles: string[] = [];

        for(const group of data.groups) {
            const relatedRoles = App.container('auth').config.permissions.groups.find(g => g.name === group)?.roles ?? [];

            updatedRoles = [
                ...updatedRoles,
                ...relatedRoles
            ]
        }

        data.roles = updatedRoles

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
