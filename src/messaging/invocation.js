export class Invocation{
    constructor( method, context ){
        this.method = method
        this.context = context
        this.disposeStrategy = ( () => {} )
        this.disposed = false
    }

    setDisposeStrategy( strategy ){
        this.disposeStrategy = (typeof strategy == 'function')? strategy : function(){}
    }

    dispose(){
        this.disposeStrategy()
        this.disposed = true
    }
}