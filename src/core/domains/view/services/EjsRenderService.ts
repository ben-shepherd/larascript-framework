import ejs from 'ejs';

import { IViewServiceConfig } from '../interfaces/config';
import { RenderData } from "../interfaces/data";
import { IViewRenderService } from "../interfaces/services";

class EjsRenderService implements IViewRenderService {

    // eslint-disable-next-line no-unused-vars
    constructor(protected readonly config: IViewServiceConfig) {}
    
    async render({ view, data }: RenderData): Promise<string> {
        return new Promise((resolve, reject) => {

            if(!view.endsWith('.ejs')) {
                view  = `${view}.ejs`
            }

            const viewPath = require('path')
                .join(process.cwd(), 'src', this.config.resourcesDir, 'views', view)

            const cb = (err, str) => {
                if(err) {
                    reject(err)
                }
                resolve(str)
            }

            ejs.renderFile(viewPath, { ...data }, cb)
        })
    }

}

export default EjsRenderService