import EventListener from "@src/core/events/EventListener";

export class LoginListener extends EventListener {
    
    public handle(): void {
        console.log('[LoginListener]')
    }
}