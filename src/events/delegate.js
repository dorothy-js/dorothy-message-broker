import { Delegate as MessageDelegate } from '../messaging/delegate'

export class Delegate extends MessageDelegate{

    constructor(){
        super()
    }

    fire( ...args ){
        let message, all
        message = args[1]

        all = this.stack.slice().reverse().map( invocation => {
            return Promise.resolve(true).then(() =>{
                if( message.isEventPropagationStopped && message.isEventPropagationStopped() ){
                    return
                }

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
