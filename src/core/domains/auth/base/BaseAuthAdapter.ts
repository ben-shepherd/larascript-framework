import { IRouter } from "../../http/interfaces/IRouter";
import Router from "../../http/router/Router";
import { IAclConfig, IAclGroup, IAclRole } from "../interfaces/acl/IAclConfig";
import { IAuthAdapter } from "../interfaces/adapter/IAuthAdapter";
import { IBaseAuthConfig } from "../interfaces/config/IAuth";
import { IUserModel } from "../interfaces/models/IUserModel";

/**
 * Base authentication adapter class that implements the IAuthAdapter interface.
 * Provides core functionality for authentication adapters.
 * @template Config - The configuration type that extends IBaseAuthConfig
 */
class BaseAuthAdapter<Config extends IBaseAuthConfig> implements IAuthAdapter<Config> {

    public config!: Config;

    protected aclConfig!: IAclConfig
    
    constructor(config: Config, aclConfig: IAclConfig) {
        this.config = config;
        this.aclConfig = aclConfig;
    }
    
    /**
     * Boots the adapter
     * @returns A promise that resolves when the adapter is booted
     */
    public async boot(): Promise<void> {
        return Promise.resolve();
    }


    /**
     * Retrieves the current configuration
     * @returns The current configuration object
     */

    getConfig(): Config {
        return this.config;
    }

    /**
     * Updates the configuration
     * @param config - The new configuration object to set
     */
    setConfig(config: Config): void {
        this.config = config;
    }

    /**
     * Creates and returns a new router instance
     * @returns A new IRouter instance
     */
    getRouter(): IRouter {
        return new Router();
    }

    /**
     * Retrieves the groups from the roles
     * @param roles 
     * @returns 
     */
    getGroupsFromRoles(roles: string[] | string): IAclGroup[] {
        const rolesArray = typeof roles === 'string' ? [roles] : roles;
        const groups: IAclGroup[] = [];
    
        for(const role of rolesArray) {
            const group = this.aclConfig.groups.find(g => g.roles.includes(role));
    
            if(group) {
                groups.push(group);
            }
        }
    
        return groups;
    }
        
    /**
     * Retrieves the role from the group
     * @param group 
     * @returns 
     */
    getRoleFromGroup(group: IAclGroup): IAclRole | null {
        return this.aclConfig.roles.find(r => r.name === group.name) ?? null;
    }

    
    /**
     * Retrieves the scopes from the roles
    * @param user 
    * @returns 
    */
    getRoleScopes(user: IUserModel): string[] {
        const roles = user.getAttributeSync('roles') as string[] | null;
    
        if(!roles) {
            return [];
        }
    
        const groups = this.getGroupsFromRoles(roles);
        let scopes: string[] = [];
    
        for(const group of groups) {
            const role = this.getRoleFromGroup(group);
            scopes = [...scopes, ...(role?.scopes ?? [])];
        }

        return scopes;
    }

}

export default BaseAuthAdapter;

