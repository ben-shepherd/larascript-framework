import BaseProvider from '@src/core/base/Provider';
import { App } from '@src/core/services/App';
import Worker from '../services/Worker';

export default class WorkerProvider extends BaseProvider
{
    async register(): Promise<void> {
        console.log('Registering WorkerProvider')
        
        App.setContainer('worker', Worker.getInstance())
    }

    async boot(): Promise<void> {
        console.log('Booting WorkerProvider')
    }
}