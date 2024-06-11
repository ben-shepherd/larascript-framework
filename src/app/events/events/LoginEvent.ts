import User from "@src/app/models/auth/User";
import EventDispatcher from "@src/core/events/EventDispatcher";
import { IEventDispatcher } from "@src/core/interfaces/events/IEventDispatcher";
import { ObjectId } from "mongodb";

export default class LoginEvent extends EventDispatcher implements IEventDispatcher {
    constructor(user: User) {

        if(user.getId() instanceof ObjectId === false) {
            throw new Error('User id was not found')
        }

        const payload = {
            userId: user.getId()?.toString() as string
        }

        super('OnLogin', payload)
    }
}