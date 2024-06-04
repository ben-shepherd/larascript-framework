import health from '../actions/actions/health';
import { IRoute } from '../interfaces/IRoute';

const routes: IRoute[] = [
    {
        name: 'health',
        method: 'get',
        path: '/api/health',
        action: health
    }
]

export default routes;
