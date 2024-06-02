import apiTokenFactory from '../domains/Auth/factory/apiTokenFactory';
import jwtTokenFactory from '../domains/Auth/factory/jwtTokenFactory';
import userFactory from '../domains/Auth/factory/userFactory';
import ApiTokenModel from '../domains/Auth/models/ApiTokenModel';
import UserModel from '../domains/Auth/models/UserModel';
import ApiTokenRepository from '../domains/Auth/repository/ApiTokenRepository';
import UserRepository from '../domains/Auth/repository/UserRepository';
import { JWTToken } from '../domains/Auth/types/types.t';
import comparePassword from '../domains/Auth/utils/comparePassword';
import createJwt from '../domains/Auth/utils/createJwt';
import decodeJwt from '../domains/Auth/utils/decodeJwt';
import { IAuth } from '../interfaces/IAuth';

export default class Auth implements IAuth {
    private static instance: Auth;
    private userRepository: UserRepository;
    private apiTokenRepository: ApiTokenRepository;

    private constructor() {
        this.userRepository = new UserRepository();
        this.apiTokenRepository = new ApiTokenRepository();
    }

    public static getInstance(): Auth {
        if (!Auth.instance) {
            Auth.instance = new Auth();
        }
        return Auth.instance;
    }

    async createUser(email: string, password: string): Promise<UserModel> {
        const user = userFactory(email, password);
        await user.save();
        return user
    }

    async createToken(user: UserModel): Promise<ApiTokenModel> {
        const apiToken = apiTokenFactory(user);
        await apiToken.save();
        return apiToken
    }

    async revokeToken(apiToken: ApiTokenModel): Promise<void> {
        if(apiToken?.data?.revokedAt) {
            return;
        }

        apiToken.setAttribute('revokedAt', new Date());
        await apiToken.save();
    }

    jwt(apiToken: ApiTokenModel): string {
        const payload = jwtTokenFactory(apiToken.data?.userId, apiToken.data?.token);
        return createJwt(payload, '1d');
    }

    async authenticateToken(token: string): Promise<ApiTokenModel | null> {
        const decoded = decodeJwt(token) as JWTToken;

        const apiToken = await this.apiTokenRepository.findByUnrevokedToken(decoded.token)

        if(!apiToken) {
            throw new Error('Unauthorized (Error code: 1)')
        }

        const user = await this.userRepository.findById(decoded.uid)

        if(!user) {
            throw new Error('Unauthorized (Error code: 2)')
        }

        return apiToken
    }

    async check(): Promise<boolean> {
        return true;
    }

    async login(email: string, password: string): Promise<string> {
        const user = await this.userRepository.findByEmail(email);

        if(!user) {
            throw new Error('Unauthorized (Error code: 1)')
        }

        if(!comparePassword(password, user.data?.hashedPassword)) {
            throw new Error('Unauthorized (Error code: 2)')
        }

        const apiToken = apiTokenFactory(user);
        await apiToken.save();

        return this.jwt(apiToken);
    }

    async logout(apiToken: ApiTokenModel): Promise<void> {
        apiToken.setAttribute('revokedAt', new Date());
        await apiToken.save();
    }
}