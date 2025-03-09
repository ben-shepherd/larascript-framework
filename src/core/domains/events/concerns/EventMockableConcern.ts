import { IBaseEvent } from "@src/core/domains/events/interfaces/IBaseEvent";
import { IMockableConcern, TMockableEventCallback } from "@src/core/domains/events/interfaces/IMockableConcern";
import { TClassConstructor } from "@src/core/interfaces/ClassConstructor.t";
import EventNotDispatchedException from "@src/core/domains/events/exceptions/EventNotDispatchedException";


const EventMockableConcern = (Base: TClassConstructor) => {
    return class EventMockable extends Base implements IMockableConcern {

        /** Array of events to mock */
        mockEvents: TClassConstructor<IBaseEvent>[] = [];

        /** Array of events that have been dispatched */
        mockEventsDispatched: IBaseEvent[] = [];

        /**
         * Mocks an event to be dispatched.
         * 
         * The mocked event will be added to the {@link mockEvents} array.
         * When the event is dispatched, the {@link mockEventDispatched} method
         * will be called and the event will be added to the {@link mockEventsDispatched} array.
         * 
         * @param event The event to mock.
         */
        mockEvent(event: TClassConstructor<IBaseEvent>): void {
            this.mockEvents.push(event)
            this.removeMockEventDispatched(event)
        }

        /**
         * Removes the given event from the {@link mockEvents} array.
         * 
         * @param event - The event to remove from the {@link mockEvents} array.
         */
        removeMockEvent(event: TClassConstructor<IBaseEvent>): void {
            this.mockEvents = this.mockEvents.filter(e => (new e).getName() !== (new event).getName())
        }

        /**
         * This method is called when an event is dispatched. It will check if the event
         * has been mocked with the {@link mockEvent} method. If it has, the event will be
         * added to the {@link mockEventsDispatched} array.
         * 
         * @param event - The event that was dispatched.
         */
        mockEventDispatched(event: IBaseEvent): void {

            const shouldMock = this.mockEvents.find(eCtor => (new eCtor(null)).getName() === event.getName())

            if(!shouldMock) {
                return
            }
            
            this.mockEventsDispatched.push(event)
        }

        /**
         * Removes all events from the {@link mockEventsDispatched} array that match the given event constructor.
         * 
         * @param event - The event to remove from the {@link mockEventsDispatched} array.
         */
        removeMockEventDispatched(event: TClassConstructor<IBaseEvent>): void {
            this.mockEventsDispatched = this.mockEventsDispatched.filter(e => e.getName() !== (new event).getName())
        }


        /**
         * Asserts that a specific event has been dispatched and that its payload satisfies the given condition.
         * 
         * @param eventCtor - The event to check for dispatch.
         * @param callback - A function that takes the event payload and returns a boolean indicating 
         *                   whether the payload satisfies the condition.
         * 
         * @throws Will throw an error if the event was not dispatched or if the dispatched event's 
         *         payload does not satisfy the given condition.
         */
        assertDispatched<TPayload = unknown>(eventCtor: TClassConstructor<IBaseEvent>, callback?: TMockableEventCallback<TPayload>): boolean {
            const eventCtorName = (new eventCtor(null)).getName()
            const dispatchedEvent = this.mockEventsDispatched.find(e => e.getName() === eventCtorName)

            if(!dispatchedEvent) {
                throw new EventNotDispatchedException(`Event ${eventCtorName} was not dispatched`)
            }

            if(typeof callback !== 'function') {
                return true;
            }

            return callback(dispatchedEvent.getPayload() as TPayload)
        }

        /**
         * Resets the {@link mockEvents} and {@link mockEventsDispatched} arrays.
         */
        resetMockEvents(): void {
            this.mockEvents = [];
            this.mockEventsDispatched = [];
        }
    
    }
}

export default EventMockableConcern