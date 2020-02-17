import { Message } from '../messaging/message'

export class Property extends Message{

    /**
     * Property constructor.
     *
     * @param string name The Publication name this Event belongs to.
     */
    constructor( name ){
        super(name)
        this.property = null
    }

    exists(){
        return null !== this.property
    }
}
