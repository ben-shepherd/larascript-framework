/* eslint-disable no-unused-vars */
import { RenderData } from "./data";

export interface IViewService {
    ejs(): IViewRenderService;
}

export interface IViewRenderService {
    render(data: RenderData): Promise<string>
}