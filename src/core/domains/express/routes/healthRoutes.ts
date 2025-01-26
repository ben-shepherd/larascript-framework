import health from '@src/core/actions/health';
import { IRouteLegacy } from '@src/core/domains/express/interfaces/IRouteLegacy';

const healthRoutes: IRouteLegacy[] = [
    {
        name: 'health',
        method: 'get',
        path: '/health',
        action: health
    }
]

export default healthRoutes;
