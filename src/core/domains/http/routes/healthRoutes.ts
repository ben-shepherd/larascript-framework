import health from '@src/core/actions/health';

import Route from '../router/Route';

export default Route.group(router => {
    router.get('/health', health)
})
