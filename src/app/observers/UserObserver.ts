import { IUserData } from "@src/core/domains/auth/interfaces/IUserModel";
import hashPassword from "@src/core/domains/auth/utils/hashPassword";
import Observer from "@src/core/domains/observer/services/Observer";

export default class UserObserver extends Observer<IUserData>
{  
    creating(data: IUserData): IUserData {
        data = this.onPasswordChange(data)
        return data
    }

    onPasswordChange(data: IUserData): IUserData {
        if(!data.password) {
            return data
        }

        data.hashedPassword = hashPassword(data.password);
        delete data.password;

        return data
    }
}