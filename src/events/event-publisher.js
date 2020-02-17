import { Publisher } from '../messaging/publisher'
import { Delegate } from './delegate'

export class EventPublisher extends Publisher{
    constructor( publications ){
        super([])
        publications = Array.isArray(publications)? publications : []

        this.publications = {}

        for( let name of publications ){
            this.publications[name] = new Delegate()
        }
    }

    fire( name, message, context ){
        context = context || this
        if( this.publications[name] ){
            return this.publications[name].fire(context, message)
        }

        return Promise.resolve(true)
    }
}
