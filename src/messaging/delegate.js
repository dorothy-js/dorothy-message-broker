import { Invocation } from './invocation'

export class Delegate{

    constructor(){
        this.stack = []
        this.once = []
    }
    /**
     * Adds a listener to this delegate.
     *
     * The invocation are prepended in the stack in order
     * to get the fire method work properly.
     *
     * @see fire
     * @param Function  fn      the listener
     * @param mixed     context the context of the listener
     * @param bool      once    whether or not to unsubscribe the listener
     *                          after its first execution.
     * @return null
     */
    add( fn, context, once ){
        let invocation

        invocation = new Invocation(fn, context)

        for( let i = 0; i < this.stack.length; i++ ){
            if( fn === this.stack[i].method ){
                return
            }
        }

        this.stack.unshift(invocation)

        if( once ){
            this.once.unshift(invocation)
        }

        invocation.setDisposeStrategy(() => {
            for( let i = 0; i < this.stack.length; i++ ){
                if( fn === this.stack[i].method ){
                    this.stack.splice(i, 1)
                }
            }

            for( let j = 0; j < this.once.length; j++ ){
                if( fn === this.once[j].method ){
                    this.once.splice(j, 1)
                }
            }
        })

        return invocation
    }

    /**
     * TODO: REMOVE
     * Removes a listener from this delegate.
     *
     * @param Function  fn      the listener
     * @param mixed     context the context of the listener
     *
     * @return null
     */
    remove( fn ){
        let n, m

        n = this.stack.length
        m = this.once.length
        for( let i = 0; i < n; i++ ){
            if( fn === this.stack[i].method ){
                this.stack.splice(i, 1)
            }
        }

        for( let j = 0; j < m; j++ ){
            if( fn === this.once[j].method ){
                this.once.splice(j, 1)
            }
        }
    }

    /**
     * Executes all the listeners in the stack.
     * This method accepts any number of arguments
     * but assumes that the first one is the caller of this method
     * and the second one is an instance of Message.
     *
     * The loop is done backward in order to allow removing
     * the invocations from the stack without breaking the loop index.
     * We are relying on the fact that the `add` method
     * prepends the invocations in the stack thus, going
     * backward, we are executing the stack in the expected order.
     *
     * @return null
     */
    fire( ...args ){
        let all

        all = this.stack.slice().reverse().map( invocation => {
            return Promise.resolve(true).then(() =>{
                if( this.stack.includes(invocation) ){
                    let p = invocation.method.apply(invocation.context, args)
                    for( let j = 0; j < this.once.length; j++ ){
                        if( invocation.method === this.once[j].method ){
                            invocation.dispose()
                        }
                    }
                    return p
                }
            })
        })

        return Promise.all(all)
    }
}
