import apiTokenFactory from '../domains/Auth/factory/apiTokenFactory';
import jwtTokenFactory from '../domains/Auth/factory/jwtTokenFactory';
import ApiTokenModel from '../domains/Auth/models/ApiTokenModel';
import UserModel from '../domains/Auth/models/UserModel';
import ApiTokenRepository from '../domains/Auth/repository/ApiTokenRepository';
import UserRepository from '../domains/Auth/repository/UserRepository';
import UnauthorizedError from '../exceptions/UnauthorizedError';
import { IAuth } from '../interfaces/IAuth';
import Singleton from '../base/Singleton';
import comparePassword from '../domains/Auth/utils/comparePassword';
import decodeJwt from '../domains/Auth/utils/decodeJwt';
import createJwt from '../domains/Auth/utils/createJwt';
import { JWTToken } from '../domains/Auth/types/types.t';

export default class Auth extends Singleton<any> implements IAuth {
    private userRepository: UserRepository;
    private apiTokenRepository: ApiTokenRepository;

    constructor() {
        super()
        this.userRepository = new UserRepository();
        this.apiTokenRepository = new ApiTokenRepository();
    }

    async createToken(user: UserModel): Promise<string> {
        const apiToken = apiTokenFactory(user);
        await apiToken.save();
        return this.jwt(apiToken)
    }

    private jwt(apiToken: ApiTokenModel): string {
        const payload = jwtTokenFactory(apiToken.data?.userId, apiToken.data?.token);
        return createJwt(payload, '1d');
    }

    async revokeToken(apiToken: ApiTokenModel): Promise<void> {
        if(apiToken?.data?.revokedAt) {
            return;
        }

        apiToken.setAttribute('revokedAt', new Date());
        await apiToken.save();
    }

    async authenticateToken(token: string): Promise<ApiTokenModel | null> {
        const decoded = decodeJwt(token) as JWTToken;

        const apiToken = await this.apiTokenRepository.findByUnrevokedToken(decoded.token)

        if(!apiToken) {
            throw new UnauthorizedError('Unauthorized (Error code: 1)')
        }

        const user = await this.userRepository.findById(decoded.uid)

        if(!user) {
            throw new UnauthorizedError('Unauthorized (Error code: 2)')
        }

        return apiToken
    }

    async login(email: string, password: string): Promise<string> {
        const user = await this.userRepository.findByEmail(email);

        if(!user) {
            throw new UnauthorizedError('Unauthorized (Error code: 1)')
        }

        if(!comparePassword(password, user.data?.hashedPassword)) {
            throw new UnauthorizedError('Unauthorized (Error code: 2)')
        }

        const apiToken = apiTokenFactory(user);
        await apiToken.save();

        return this.jwt(apiToken);
    }
}