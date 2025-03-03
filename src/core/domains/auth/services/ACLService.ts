import { IACLService } from "@src/core/domains/auth/interfaces/acl/IACLService";
import { IAclConfig, IAclGroup, IAclRole } from "@src/core/domains/auth/interfaces/acl/IAclConfig";
import { IUserModel } from "@src/core/domains/auth/interfaces/models/IUserModel";
import { app } from "@src/core/services/App";

// Short hand for app('auth.acl')
export const acl = () => app('auth.acl');

/**
 * Access Control List (ACL) Service
 * 
 * This service manages role-based access control (RBAC) by:
 * - Managing user groups and their associated roles
 * - Managing roles and their associated permissions/scopes
 * - Providing methods to retrieve and validate permissions
 * 
 * The service works with a configuration object that defines:
 * - Groups (e.g. 'Admin', 'User') 
 * - Roles (e.g. 'role_admin', 'role_user')
 * - Scopes/permissions for each role
 */
class ACLService implements IACLService {

    private aclConfig: IAclConfig;

    constructor(aclConfig: IAclConfig) {
        this.aclConfig = aclConfig;
    }

    /**
     * Get the ACL config
     * @returns 
     */
    getConfig(): IAclConfig {
        return this.aclConfig;
    }

    /**
     * Get the default group
     * @returns 
     */
    getDefaultGroup(): IAclGroup {
        return this.getGroup(this.aclConfig.defaultGroup);
    } 

    /**
     * Get the group
     * @param group 
     * @returns 
     */
    getGroup(group: string): IAclGroup {
        const result = this.aclConfig.groups.find(g => g.name === group);

        if(!result) {
            throw new Error(`Group ${group} not found`);
        }

        return result;
    }

    /**
     * Get the roles from the group
     * @param group 
     * @returns 
     */
    getGroupRoles(group: string | IAclGroup): IAclRole[] {
        const groupResult = typeof group === 'string' ? this.getGroup(group) : group;
        return groupResult.roles.map(role => this.getRole(role));
    }

    /**
     * Get the scopes from the group
     * @param group 
     * @returns 
     */
    getGroupScopes(group: string | IAclGroup): string[] {
        const roles = this.getGroupRoles(group);
        return roles.map(role => role.scopes).flat();
    }

    /**
     * Retrieves the scopes from the roles

    * @param user 
    * @returns 
    */
    getRoleScopesFromUser(user: IUserModel): string[] {
        const roles = user.getAttributeSync('roles') as string[] | null;
        
        if(!roles) {
            return [];
        }
        
        let scopes: string[] = [];
        
        for(const roleString of roles) {
            const role = this.getRole(roleString);
            scopes = [...scopes, ...role.scopes];
        }
    
        return scopes;
    }

    /**
     * Retrieves the role from the config
     * @param role 
     * @returns 
     */
    getRole(role: string): IAclRole {
        const result = this.aclConfig.roles.find(r => r.name === role);

        if(!result) {
            throw new Error(`Role ${role} not found`);
        }

        return result;
    }


    /**
     * Retrieves the scopes from the roles
     * @param role 
     * @returns 
     */
    getRoleScopes(role: string | string[]): string[] {
        const rolesArray = typeof role === 'string' ? [role] : role;
        let scopes: string[] = [];

        for(const roleStr of rolesArray) {
            const role = this.getRole(roleStr);
            scopes = [...scopes, ...role.scopes];
        }

        return scopes;

    }

    /**
     * Assigns a role to a user
     * @param user 
     * @param role 
     */
    async assignRoleToUser(user: IUserModel, role: string | string[]): Promise<void> {
        const rolesArray = typeof role === 'string' ? [role] : role;

        user.setAttribute('roles', rolesArray);
    }

    /**
     * Assigns a group to a user
     * @param user 
     * @param group 
     */
    async assignGroupToUser(user: IUserModel, group: string | string[]): Promise<void> {
        const groupsArray = typeof group === 'string' ? [group] : group;

        user.setAttribute('groups', groupsArray);
    }

    /**
     * Removes a role from a user
     * @param user 
     * @param role 
     */
    async removeRoleFromUser(user: IUserModel, role: string | string[]): Promise<void> {
        const currentRoles = user.getAttributeSync('roles') as string[] | null ?? [];
        const rolesArray = typeof role === 'string' ? [role] : role;
        const newRoles = currentRoles.filter(r => !rolesArray.includes(r));

        user.setAttribute('roles', newRoles);
    }

    /**
     * Removes a group from a user
     * @param user 
     * @param group 
     */
    async removeGroupFromUser(user: IUserModel, group: string | string[]): Promise<void> {
        const currentGroups = user.getAttributeSync('groups') as string[] | null ?? [];
        const groupsArray = typeof group === 'string' ? [group] : group;
        const newGroups = currentGroups.filter(g => !groupsArray.includes(g));

        user.setAttribute('groups', newGroups);
    }

}

export default ACLService;
