import { Delegate } from './delegate'


export class Publisher{
    constructor( publications ){
        publications = Array.isArray(publications)? publications : []

        this.publications = {}

        for( let name of publications ){
            if( !name ){
                throw 'Pollon: [broker-provider] Cannot define a publisher with an falsy/undefined name'
            }
            this.publications[name] = new Delegate()
        }
    }

    /**
     * Returns a Delegate by its name.
     *
     * @param string name the event name
     * @return Delegate
     */
    getDelegate( name ){
        return ( name in this.publications )? this.publications[name] : null
    }

    /**
     * Given a name and a Message instance, fires the associated publication.
     *
     * @param string name The message name
     * @param Message message The message arguments
     * @return null
     */
    fire( name, message, context ){
        context = context || this
        if( this.publications[name] ){
            return this.publications[name].fire(context, message)
        }

        return Promise.resolve(true)
    }
}
