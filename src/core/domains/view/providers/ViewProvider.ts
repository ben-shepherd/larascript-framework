import BaseProvider from "@src/core/base/Provider";

import { IViewServiceConfig } from "@src/core/domains/view/interfaces/config";
import ViewService from "@src/core/domains/view/services/ViewService";

class ViewProvider extends BaseProvider {

    protected config: IViewServiceConfig = {
        resourcesDir: 'app/resources'
    }

    async boot(): Promise<void> {
        
        const viewService = new ViewService(this.config);

        this.bind('view', viewService)
        this.bind('view:ejs', viewService.ejs())
    }

}

export default ViewProvider