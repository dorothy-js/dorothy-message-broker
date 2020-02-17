import { isObject } from '../utils/is-object'

/**
 * Subscriber constructor.
 *
 * @param Object subscriptions      an object whose keys are message names
 *                                  and whose values are callback to be triggered
 *                                  when those message get dispatched.
 */
export class Subscriber{
    constructor( subscriptions ){
        this.subscriptions = isObject(subscriptions) ? subscriptions : {}
    }
}
