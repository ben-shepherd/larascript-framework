
import { IViewServiceConfig } from "../interfaces/config";
import { RenderData } from "../interfaces/data";
import { IViewRenderService, IViewService } from "../interfaces/services";
import EjsRenderService from './EjsRenderService';

class ViewService implements IViewService {

    // eslint-disable-next-line no-unused-vars
    constructor(protected readonly config: IViewServiceConfig) {}

    render(data: RenderData): Promise<string> {
        return this.ejs().render(data)
    }

    ejs(): IViewRenderService {
        return new EjsRenderService(this.config)
    }

}

export default ViewService