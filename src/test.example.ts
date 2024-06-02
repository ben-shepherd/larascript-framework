import MongoDB from "./services/MongoDB";

require('dotenv').config();

(async() => {
    await MongoDB.getInstance().connect();
    // add your tests here below

    
})();