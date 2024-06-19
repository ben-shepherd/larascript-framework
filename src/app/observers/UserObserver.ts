import Observer from "@src/core/observer/Observer";
import { UserData } from "../models/auth/User";

export default class UserObserver extends Observer<UserData>
{  
    updating = (data: UserData): UserData => {
        return data
    }

    onPasswordChanged = (data: UserData): UserData => {
        console.log(`[UserObserver] ${data.email} changed their password`)
        return data
    }
}