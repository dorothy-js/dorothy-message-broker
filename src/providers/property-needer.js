import { Publisher } from '../messaging/publisher'
import { Property } from './property'

export class PropertyNeeder extends Publisher{
    constructor( publications ){
        super(publications)
    }

    getProperty( name ){
        let delegate = this.getDelegate( name )
        if( !delegate || !delegate.stack.length ){
            throw `Pollon: [broker-provider] provider not found for the property ${name}`
        }

        let property = new Property(name)
        return this.fire(name, property, this)
            .catch( reason => { throw `Pollon: [broker-provider] error ${reason} when looking for provider for the property ${name}` })
            .then( __ =>{
                if( !property.exists() ){
                    throw `Pollon: [broker-provider] provider not found for the property ${name}`
                }
                return property.property
            })
    }
}
