import Observer from "@src/core/observer/Observer";
import { UserData } from "../interfaces/UserData";

export default class UserObserver extends Observer<UserData>
{  
    creating = (data: UserData): UserData => {
        console.log('[UserObserver]', 'userCreating')
        data.test = [...(data.test ?? []), 'creating']
        return data
    }

    created = (data: UserData): UserData => {
        console.log('[UserObserver]', 'userCreated')
        data.test = [...(data.test ?? []), 'created']
        return data
    }

    /**
     * todo: Remove this eventually (or replace it with an example)
     */
    onEmailChange = (data: UserData): UserData => {
        console.log('[UserObserver] onEmailChange', data)
        return data
    }
}