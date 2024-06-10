import ApiTokenRepository from '@src/app/repositories/auth/ApiTokenRepository';
import UserRepository from '@src/app/repositories/auth/UserRepository';
import ApiToken from '../../../../app/models/auth/ApiToken';
import { IAuth } from '../../../interfaces/IAuth';
import { IAuthConfig } from '../../../interfaces/IAuthConfig';


export default class Auth<Service extends IAuth> implements IAuth {
    public config!: IAuthConfig;
    public service!: Service;
    public userRepository!: UserRepository;
    public apiTokenRepository!: ApiTokenRepository;

    private static instances: Map<string, Auth<any>> = new Map();

    constructor(serviceCtor: new (config: IAuthConfig) => Service, config: IAuthConfig) {
        this.service = new serviceCtor(config)
        this.userRepository = new config.userRepository()
        this.apiTokenRepository = new config.apiTokenRepository()
    }

    repoistory(repo: 'user' | 'apiToken'): UserRepository | ApiTokenRepository {
        return repo === 'user' ? this.userRepository : this.apiTokenRepository
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

    public static getInstance<Service extends IAuth>(serviceCtor?: new (config: IAuthConfig) => Service, config?: IAuthConfig): Auth<Service> {
        if(serviceCtor && config) {
            const key = serviceCtor.name;
            
            if(!Auth.instances.has(key)) {
                Auth.instances.set(key, new Auth(serviceCtor, config));
            }
    
            return Auth.instances.get(key) as Auth<Service>;
        }
        else {
            const firstEntry = Auth.instances.values().next().value;

            if(!firstEntry) {
                throw new Error('Auth has not been configured')
            }
            
            return firstEntry
        }
    }
}