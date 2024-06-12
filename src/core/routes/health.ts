import health from '../actions/health';
import { Route } from '../interfaces/IRoute';

const routes: Route[] = [
    {
        name: 'health',
        method: 'get',
        path: '/health',
        action: health
    }
]

export default routes;
