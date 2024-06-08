import Kernel from "./core/kernel";
import MongoDBProvider from "./core/providers/MongoDBProvider";

(async() => {
    require('dotenv').config();

    await Kernel.boot({
        environment: 'testing',
        providers: [
            new MongoDBProvider()
        ]
    })

    // add your tests here below

})();