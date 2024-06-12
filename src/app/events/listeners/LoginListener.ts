import EventListener from "@src/core/events/EventListener";
import { App } from "@src/core/services/App";
import { LoginEventPayload } from "../events/LoginEvent";

export class LoginListener extends EventListener {

    handle = async (payload: LoginEventPayload) => {
        console.log('[LoginListener]', {payload})

        const user = await App.container('auth').userRepository.findById(payload.userId)
        user?.setAttribute('lastLoginAt', new Date())
        await user?.save()

        console.log(user)
    }
}