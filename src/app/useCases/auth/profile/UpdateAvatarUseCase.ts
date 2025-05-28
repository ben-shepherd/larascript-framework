import BadResponseException from "@src/app/errors/BadResponseException";
import { IUseCase } from "@src/app/interfaces/UseCases";
import User from "@src/app/models/auth/User";
import GetUserProfile, { GetUserProfileResponse } from "@src/app/services/auth/GetUserProfile";
import { IUserModel } from "@src/core/domains/auth/interfaces/models/IUserModel";
import HttpContext from "@src/core/domains/http/context/HttpContext";
import ApiResponse from "@src/core/domains/http/response/ApiResponse";
import StorageFile from "@src/core/domains/storage/data/StorageFile";
import { S3Meta } from "@src/core/domains/storage/interfaces/meta";
import { storage } from "@src/core/domains/storage/services/StorageService";

export type UpdateAvatarUseCaseResponse = ApiResponse<{ message: string } | GetUserProfileResponse>

class UpdateAvatarUseCase implements IUseCase {

    protected getUserProfile = new GetUserProfile()

    async invoke(context: HttpContext): Promise<UpdateAvatarUseCaseResponse> {
        const response = new ApiResponse()

        try {
            let user: IUserModel = context.getUser() as IUserModel

            const s3file = await this.handleFileUpload(context, user)

            user = await this.handleUpdateUser(s3file, user)

            return (await this.getUserProfile.getApiResponse(user)).setCode(200)
        }
        catch (err) {
            response.setData({
                message: (err as Error).message,
                stack: (err as Error).stack
            }).setCode(500)

            if(err instanceof BadResponseException) {
                response.setCode(422)
            }
        }

        return response as UpdateAvatarUseCaseResponse
    }

    /**
     * Handle avatar upload
     * @returns 
     */
    protected async handleFileUpload(context: HttpContext, user: IUserModel): Promise<StorageFile<S3Meta>> {
        const file = context.getFile('file')

        if (!file) {
            throw new Error('No file uploaded')
        }

        // Upload locally
        const uploadedFile = await context.uploadFile(file)
        
        // Handle s3
        const key = `avatars/${user.attrSync('id')}`
        await storage().driver('s3').put(uploadedFile, key)
        const s3GetResult = await storage().driver('s3').get(key)

        // Delete locally
        await storage().delete(uploadedFile)

        return s3GetResult as StorageFile<S3Meta>
    }

    /**
     * Update the user model
     * @returns 
     */
    protected async handleUpdateUser(uploadedFile: StorageFile<S3Meta>, user: IUserModel): Promise<IUserModel> {
        
        const presignedUrl = uploadedFile.getPresignedUrl()
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

        await user.setAttribute(User.PROFILE_PICTURE_URL, presignedUrl);
        await user.setAttribute(User.PROFILE_PICTURE_EXPIRES_AT, expiresAt); 
        await user.save()

        return user
    }

}

export default UpdateAvatarUseCase