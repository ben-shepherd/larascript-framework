import { IRoute } from './interfaces/IRoute';
import health from './routes/api/health';

const routes: { [key: string]: IRoute } = {
    /*
    example: {
        method: 'get',
        path: '/api/example',
        handler: (req, res) => {
            res.send({ message: 'Hello, world!' });
        }
    },
    */
    hello: {
        method: 'get',
        path: '/api/hello',
        handler: health
    }
};

export default routes;
