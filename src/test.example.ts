import MongoDB from "./services/MongoDB";

(async() => {
    require('dotenv').config();
    await MongoDB.getInstance(require('./config/database/mongodb').default).connect();
    // add your tests here below


})();