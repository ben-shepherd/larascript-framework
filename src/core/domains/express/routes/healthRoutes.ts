import health from '@src/core/actions/health';
import { IRoute } from '@src/core/domains/express/interfaces/IRoute';

const healthRoutes: IRoute[] = [
    {
        name: 'health',
        method: 'get',
        path: '/health',
        action: health
    }
]

export default healthRoutes;
