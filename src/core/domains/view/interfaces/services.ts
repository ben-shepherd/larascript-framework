/* eslint-disable no-unused-vars */
import { RenderData } from "@src/core/domains/view/interfaces/data";

export interface IViewService extends IViewRenderService {
    ejs(): IViewRenderService;
}

export interface IViewRenderService {
    render(data: RenderData): Promise<string>
}