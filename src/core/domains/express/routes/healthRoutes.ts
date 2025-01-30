import health from '@src/core/actions/health';

import Route from '../routing/Route';

export default Route.group(router => {
    router.get('/health', health)
})
