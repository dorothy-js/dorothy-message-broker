import { isObject } from '../utils/is-object'
import { Delegate } from './delegate'

let indexOf = ( ( context, subject ) => Array.prototype.indexOf.call(context, subject) )

export class Broker{
    constructor(){
        this.publishers = []
        this.handlers = {}
        this.fireDelegates = {}
    }

    /**
     * Adds a brokerable (ie. a Subscriber and/or a Publisher)
     * object to this MessageBroker.
     *
     * @param mixed brokerable either a Subscriber or a Publisher or both
     * @return null
     */
    add( brokerable ){
        if( brokerable.subscriptions ){
            this.addSubscriber(brokerable)
        }
        if( brokerable.publications ){
            this.addPublisher(brokerable)
        }
    }

    /**
     * Removes a brokerable (ie. a Subscriber and/or a Publisher)
     * object from this MessageBroker.
     *
     * @param mixed brokerable either a Subscriber or a Publisher or both.
     * @return null
     */
    remove( brokerable ){
        if( brokerable.subscriptions ){
            this.removeSubscriber(brokerable)
        }
        if( brokerable.publications ){
            this.removePublisher(brokerable)
        }
        return
    }

    /**
     * Adds a Subscriber to this MessageBroker.
     *
     * @param Subscriber a Subscriber
     * @return null
     */
    addSubscriber( subscriber ){
        let i, name, handler, subscription

        if( !subscriber.subscriptions ){
            return
        }

        for( name in subscriber.subscriptions ){
            handler = subscriber.subscriptions[name]

            if( !(name in this.handlers) ){
                this.handlers[name] = new Delegate()
            }

            subscription = isObject(handler)? handler : {method: handler, context: null, once: false}
            subscription.context = handler.context || subscriber
            subscription.once = !!handler.once || false

            this.handlers[name].add(subscription.method, subscription.context, subscription.once)
        }
        return i
    }

    /**
     * Removes a Subscriber from this MessageBroker.
     *
     * @param Subscriber a Subscriber
     * @return null
     */
    removeSubscriber( subscriber ){
        let i, name, handler, subscription

        if( !subscriber.subscriptions ){
            return
        }

        for( name in subscriber.subscriptions ){
            handler = subscriber.subscriptions[name]

            if( !(name in this.handlers) ){
                continue
            }

            subscription = isObject(handler)? handler : { method: handler }

            this.handlers[name].remove(subscription.method)
        }
        return i
    }

    /**
     * Removes a Publisher from this MessageBroker.
     *
     * @param Publisher a Publisher
     * @return null
     */
    addPublisher( publisher ){
        let i, name, publication

        if( !publisher.publications ){
            return
        }

        i = indexOf(this.publishers,publisher)

        if( i > -1 ){
            return i
        }

        this.publishers[this.publishers.length] = publisher

        for( name in publisher.publications ){
            publication = publisher.publications[name]
            publication.add(this.getFireDelegate(name), null, false)
        }

        return i
    }

    /**
     * Removes a Publisher from this MessageBroker.
     *
     * @param Publisher a Publisher
     * @return null
     */
    removePublisher( publisher ){
        let i, name, publication

        if( !publisher.publications ){
            return
        }

        i = indexOf(this.publishers, publisher)

        if( -1 == i ){
            return i
        }

        this.publishers.splice(i, 1)

        for( name in publisher.publications ){
            publication = publisher.publications[name]
            publication.remove(this.getFireDelegate(name))
        }
        return i
    }

    /**
     * Returns a function that can fire the right Delegate
     * given a sender and an Message instance.
     *
     * @type Function
     */
    getFireDelegate( name ){
        if( this.fireDelegates[name] ){
            return this.fireDelegates[name]
        }

        this.fireDelegates[name] = ( sender, message ) => {
            let handler = this.handlers[message.name]? this.handlers[message.name] : null
            if( handler ){
                return handler.fire(sender, message)
            }
        }

        return this.fireDelegates[name]
    }
}
