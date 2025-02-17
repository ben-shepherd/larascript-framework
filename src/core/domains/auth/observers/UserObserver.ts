import { UserCreatedListener } from "@src/app/events/listeners/UserCreatedListener";
import { UserAttributes } from "@src/app/models/auth/User";
import { IBaseEvent } from "@src/core/domains/events/interfaces/IBaseEvent";
import Observer from "@src/core/domains/observer/services/Observer";
import { ICtor } from "@src/core/interfaces/ICtor";
import { App } from "@src/core/services/App";

import { cryptoService } from "../../crypto/service/CryptoService";

/**
 * Observer for the User model.
 * 
 * Automatically hashes the password on create/update if it is provided.
 */
export default class UserObserver extends Observer<UserAttributes> {

    protected userCreatedListener: ICtor<IBaseEvent> = UserCreatedListener;

    /**
     * Sets the listener to use after a User has been created.
     * @param listener The listener to use after a User has been created.
     * @returns The UserObserver instance.
     */
    setUserCreatedListener(listener: ICtor<IBaseEvent>) {
        this.userCreatedListener = listener
    }

    /**
     * Called when the User model is being created.
     * Automatically hashes the password if it is provided.
     * @param data The User data being created.
     * @returns The processed User data.
     */
    async creating(data: UserAttributes): Promise<UserAttributes> {
        data = this.onPasswordChange(data)
        data = await this.updateRoles(data)
        return data
    }

    /**
     * Called after the User model has been created.
     * @param data The User data that has been created.
     * @returns The processed User data.
     */
    async created(data: UserAttributes): Promise<UserAttributes> {
        await App.container('events').dispatch(new this.userCreatedListener(data))
        return data
    }

    /**
     * Updates the roles of the user based on the groups they belong to.
     * Retrieves the roles associated with each group the user belongs to from the permissions configuration.
     * @param data The User data being created/updated.
     * @returns The processed User data with the updated roles.
     */
    async updateRoles(data: UserAttributes): Promise<UserAttributes> {
        let updatedRoles: string[] = [];

        for(const group of data.groups) {
            const relatedRoles = App.container('auth.acl').getGroupRoles(group)
            const relatedRolesNames = relatedRoles.map(role => role.name)

            updatedRoles = [
                ...updatedRoles,
                ...relatedRolesNames
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
    onPasswordChange(data: UserAttributes): UserAttributes {
        if(!data.password) {
            return data
        }
        
        // Hash the password
        data.hashedPassword = cryptoService().hash(data.password);

        // Delete the password from the data
        delete data.password;

        return data
    }

}
