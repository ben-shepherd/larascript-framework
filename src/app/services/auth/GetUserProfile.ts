import User from "@src/app/models/auth/User";
import { IUserModel } from "@src/core/domains/auth/interfaces/models/IUserModel";
import ApiResponse from "@src/core/domains/http/response/ApiResponse";
import { storage } from "@src/core/domains/storage/services/StorageService";

export type GetUserProfileResponse = {
    user: IUserModel['attributes']
}

class GetUserProfile {

    async getApiResponse(user: IUserModel): Promise<ApiResponse<GetUserProfileResponse>> {
        user = await this.getUser(user)

        const response = new ApiResponse()

        const attributes = await user.toObject({ excludeGuarded: true })

        return response.setData({
            user: attributes
        }) as ApiResponse<GetUserProfileResponse>    
    }

    async getUser(user: IUserModel): Promise<IUserModel> {

        // Get the presigned url profile picture
        user = await this.withPresignedUrlProfilePicture(user)

        return user
    }

    /**
     * Updates the presignedUrl profile picture if it's expired
     * @param user 
     * @returns 
     */
    protected async withPresignedUrlProfilePicture(user: IUserModel): Promise<IUserModel> {
        const profilePictureKey = user.getAttributeSync(User.PROFILE_PICTURE_KEY)
        const profilePictureUrlExpiresAt = user.getAttributeSync(User.PROFILE_PICTURE_EXPIRES_AT)

        const hasNoKey = typeof profilePictureKey !== 'string'
        const hasExpired = profilePictureUrlExpiresAt instanceof Date && Date.now() > profilePictureUrlExpiresAt.getTime()
        const hasNoExpireySet = profilePictureUrlExpiresAt instanceof Date === false
        
        if(hasNoKey) {
            return user
        }

        if(hasExpired || hasNoExpireySet) {
            const s3result = await storage().s3().get(profilePictureKey)
            const presignedUrl = s3result.getPresignedUrl()
            const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

            await user.setAttribute(User.PROFILE_PICTURE_URL, presignedUrl)
            await user.setAttribute(User.PROFILE_PICTURE_EXPIRES_AT, expiresAt)
            await user.save()
        }

        return user
    }

}

export default GetUserProfile