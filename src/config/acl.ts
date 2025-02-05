import { IAclConfig } from "@src/core/domains/auth/interfaces/acl/IAclConfig";

// Define available groups
export const GROUPS = {
    User: 'group_user',
    Admin: 'group_admin',
} as const

// Define available roles
export const ROLES = {
    USER: 'role_user',
    ADMIN: 'role_admin'
} as const

/**
 * ACL configuration
 */
export const aclConfig: IAclConfig = {

    // Default user group
    defaultGroup: GROUPS.User,

    // List of groups
    groups: [
        {
            name: GROUPS.User,
            roles: [ROLES.USER]
        },
        {
            name: GROUPS.Admin,
            roles: [ROLES.USER, ROLES.ADMIN]
        }
    ],

    // List of roles, scopes and other permissions
    roles: [
        {
            name: ROLES.ADMIN,
            scopes: []
        },
        {
            name: ROLES.USER,
            scopes: []
        },
    ],

}