import health from '@src/core/actions/health';
import Route from '@src/core/domains/http/router/Route';

/**
 * Health routes
 */
export default Route.group(router => {
    router.get('/health', health)
})
