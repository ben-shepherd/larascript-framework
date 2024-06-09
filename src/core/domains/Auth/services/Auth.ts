import ApiToken from '../../../../app/models/ApiToken';
import ApiTokenRepository from '../../../../app/repositories/ApiTokenRepository';
import UserRepository from '../../../../app/repositories/UserRepository';
import { IAuth } from '../../../interfaces/IAuth';
import { IAuthConfig } from '../../../interfaces/IAuthConfig';


export default class BaseAuth<Service extends IAuth> implements IAuth {
    public config!: IAuthConfig;
    public service!: Service;
    public userRepository!: UserRepository;
    public apiTokenRepository!: ApiTokenRepository;

    private static instances: Map<string, BaseAuth<any>> = new Map();

    constructor(serviceCtor: new (config: IAuthConfig) => Service) {
        this.service = new serviceCtor(this.config)
    }

    attemptAuthenticateToken (token: string): Promise<ApiToken | null> {
        return this.service.attemptAuthenticateToken(token)
    }

    createToken (user: InstanceType<typeof this.service.userRepository.model>): Promise<string> {
        return this.service.createToken(user)  
    }
    
    revokeToken (apiToken: InstanceType<typeof this.service.apiTokenRepository.model>): Promise<void> {
        return this.service.revokeToken(apiToken)
    }

    attemptCredentials (email: string, password: string): Promise<string> {
        return this.service.attemptCredentials(email, password)
    }

    public static getInstance<Service extends IAuth>(serviceCtor?: new (config: IAuthConfig) => Service): BaseAuth<Service> {
        if(serviceCtor) {
            const key = serviceCtor.name;
            
            if(!BaseAuth.instances.has(key)) {
                BaseAuth.instances.set(key, new BaseAuth(serviceCtor));
            }
    
            return BaseAuth.instances.get(key) as BaseAuth<Service>;
        }
        else {
            const firstEntry = BaseAuth.instances.values().next().value;

            if(!firstEntry) {
                throw new Error('Auth has not been configured')
            }
            
            return firstEntry
        }
    }
}