import { IAppService } from "@src/app/interfaces/IAppService";
import { ICoreContainers } from "@src/core/interfaces/ICoreContainers";

export interface IContainers extends ICoreContainers {

    /**
     * Add interfaces to your container services here
     */
    app: IAppService;
}
