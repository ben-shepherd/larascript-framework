import 'tsconfig-paths/register';

import appConfig from './config/app';
import Kernel from "./core/kernel";

(async() => {
    require('dotenv').config();

    await Kernel.boot(appConfig)

    // add your tests here below


})();