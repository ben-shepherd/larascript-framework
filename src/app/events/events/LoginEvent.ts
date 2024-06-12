import User from "@src/app/models/auth/User";
import EventDispatcher from "@src/core/events/EventDispatcher";
import { ObjectId } from "mongodb";

export interface LoginEventPayload {
    userId: string;
}

export default class LoginEvent extends EventDispatcher<LoginEventPayload> {

    name = 'OnLogin'

    constructor(user: User) {
        super()

        if(user.getId() instanceof ObjectId === false) {
            throw new Error('User id was not found')
        }

        const payload: LoginEventPayload = {
            userId: user.getId()?.toString() as string
        }

        this.payload = payload
    }
}