import { IUseCase } from "@src/app/interfaces/UseCases";
import User from "@src/app/models/auth/User";
import GetUserProfile from "@src/app/services/auth/GetUserProfile";
import { IUserModel } from "@src/core/domains/auth/interfaces/models/IUserModel";
import HttpContext from "@src/core/domains/http/context/HttpContext";
import { storage } from "@src/core/domains/storage/services/StorageService";

class ClearAvatarUseCase implements IUseCase {

    protected getUserProfile = new GetUserProfile()

    async invoke(context: HttpContext): Promise<void> {
        const user: IUserModel = context.getUser() as IUserModel

        await this.removeS3(user)

        await user.setAttribute(User.PROFILE_PICTURE_URL, null)
        await user.setAttribute(User.PROFILE_PICTURE_EXPIRES_AT, null)
        await user.setAttribute(User.PROFILE_PICTURE_KEY, null)
        await user.save()
    }

    protected async removeS3(user: IUserModel) {
        const key = user.attrSync(User.PROFILE_PICTURE_KEY)

        if(typeof key === 'string') {
            try {
                await storage().s3().delete(key)
            }
            // eslint-disable-next-line no-unused-vars
            catch (err) {
                console.log(1)
            }
        }
    }

}

export default ClearAvatarUseCase