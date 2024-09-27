import UserRepository from "@src/app/repositories/auth/UserRepository";
import { IApiTokenData } from "@src/core/domains/auth/interfaces/IApitokenModel";
import IUserModel from "@src/core/domains/auth/interfaces/IUserModel";
import Observer from "@src/core/domains/observer/services/Observer";
import { App } from "@src/core/services/App";

interface IApiTokenObserverData extends IApiTokenData {

}

export default class ApiTokenObserver extends Observer<IApiTokenObserverData> {  
    
    protected readonly userRepository = new UserRepository();

    /**
     * Called when a data object is being created.
     * @param data The model data being created.
     * @returns The processed model data.
     */
    async creating(data: IApiTokenObserverData): Promise<IApiTokenObserverData> {
        data = await this.addGroupScopes(data)
        return data
    }

    /**
     * Adds scopes from groups the user is a member of to the scopes of the ApiToken being created.
     * @param data The ApiToken data being created.
     * @returns The ApiToken data with the added scopes.
     */

    async addGroupScopes(data: IApiTokenObserverData): Promise<IApiTokenObserverData> {
        const user = await this.userRepository.findById(data.userId) as IUserModel;

        if(!user) {
            return data
        }

        const userGroups = user.getAttribute('groups') ?? [];

        for(const userGroup of userGroups) {
            const group = App.container('auth').config.permissions.groups.find(g => g.name === userGroup);
            const scopes = group?.scopes ?? [];
            
            data.scopes = [
                ...data.scopes,
                ...scopes
            ]
        }

        return data
    }

}