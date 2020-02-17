import { Message } from '../messaging/message'

export class Event extends Message{

    /**
     * Event constructor.
     *
     * @param string name The Publication name this Event belongs to.
     */
    constructor( name, args ){
        super(name)
        this.propagationStopped = false
        this.args = args
    }

    /**
     * Prevents the event to propagate further.
     *
     * @return null
     */
    stopEventPropagation(){
        this.propagationStopped = true
    }

    /**
     * Whether or not the propagation of this event has being stopped.
     *
     * @return bool
     */
    isEventPropagationStopped(){
        return !!this.propagationStopped
    }
}
