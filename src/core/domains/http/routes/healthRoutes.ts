import health from '@src/core/actions/health';

import Route from '../router/Route';

/**
 * Health routes
 */
export default Route.group(router => {
    router.get('/health', health)
})
