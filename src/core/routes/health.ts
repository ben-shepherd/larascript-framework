import health from '../actions/health';
import { IRoute } from '../domains/express/interfaces/IRoute';

const routes: IRoute[] = [
    {
        name: 'health',
        method: 'get',
        path: '/health',
        action: health
    }
]

export default routes;
