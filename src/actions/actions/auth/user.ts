import { Response } from 'express';

import RequestWithUser from '../../../interfaces/IAuthorizedRequest';

export default (req: RequestWithUser, res: Response) => {
    res.send({ success: true, user: req.user?.getData({ excludeGuarded: true }) })
}