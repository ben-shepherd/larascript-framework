import EventDispatcher from "@src/core/events/EventDispatcher";

export default class ExampleEvent extends EventDispatcher<{ userId: string }> {

    name = 'OnExample'

    constructor(userId: string) {
        super()

        this.payload = {
            userId
        }
    }
}