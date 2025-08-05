import { IViewServiceConfig } from "@src/core/domains/view/interfaces/config";
import ViewProvider from "@src/core/domains/view/providers/ViewProvider";

class TestViewProvider extends ViewProvider {

    config: IViewServiceConfig = {
        resourcesDir: 'tests/larascript/view/resources'
    }

}

export default TestViewProvider