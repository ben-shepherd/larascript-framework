import { UserData } from "@src/app/interfaces/auth/UserData";
import Observer from "@src/core/observer/Observer";

export default class UserObserver extends Observer<UserData>
{  
    /**
     * Observer for listening to the User updating
     * The data can be modified here
     * [Usage]
     *      [class extends IWithObserve].observer.on('updating', data)
     * @param data 
     * @returns 
     */
    updating = (data: UserData): UserData => {
        return data
    }
    
    /**
     * An example of a custom function 
     * The data can be modified here
     * [Usage]
     *      [class extends IWithObserve].observer.onCustom('onPasswordChange', data)
     * @param data 
     * @returns 
     */
    onPasswordChanged = (data: UserData): UserData => {
        console.log(`[UserObserver] ${data.email} changed their password`)
        return data
    }
}