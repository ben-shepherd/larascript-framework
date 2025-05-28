import User from "@src/app/models/auth/User";
import { IUserModel } from "@src/core/domains/auth/interfaces/models/IUserModel";
import Controller from "@src/core/domains/http/base/Controller";
import HttpContext from "@src/core/domains/http/context/HttpContext";
import { storage } from "@src/core/domains/storage/services/StorageService";

class UpdaterAvatarController extends Controller {

    async invoke(context: HttpContext) {
        try {
            const file = context.getFile('file')
            const user = context.getUser() as IUserModel

            if (!file) {
                return this.jsonResponse({
                    message: 'No file uploaded'
                }, 422)
            }

            const uploadedFile = await context.uploadFile(file)
            const key = `avatars/${user.attrSync('id')}`

            await storage().driver('s3').put(uploadedFile, key)
            const uploadedFileS3GetResult = storage().driver('s3').get(key)

            const presignedUrlResult = (await uploadedFileS3GetResult).getPresignedUrl()

            await user.setAttribute(User.PROFILE_PICTURE_KEY, key);
            await user.setAttribute(User.PROFILE_PICTURE_URL, presignedUrlResult);
            await user.setAttribute(User.PROFILE_PICTURE_EXPIRES_AT, new Date(Date.now() + 60 * 60 * 1000)); // now + 1 hour
            await user.save()

            this.jsonResponse({
                user: {
                    profilePictureUrl: user.attrSync('profilePictureUrl')
                }
            }, 200)
        }
        catch (err) {
            this.serverError((err as Error).message)
        }
    }

}

export default UpdaterAvatarController;
