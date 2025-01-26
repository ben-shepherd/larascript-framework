export const SecurityEnum = {
    AUTHORIZED: 'authorized',
    AUTHORIZED_THROW_EXCEPTION: 'authorizedThrowException',
    RESOURCE_OWNER: 'resourceOwner',
    HAS_ROLE: 'hasRole',
    HAS_SCOPE: 'hasScope',
    RATE_LIMITED: 'rateLimited',
    ENABLE_SCOPES: 'enableScopes',
    CUSTOM: 'custom'
} as const;