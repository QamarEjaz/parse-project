import * as Parse from 'parse/node';
import { PatientV1 } from './PatientV1';
import { _User } from './_User';
interface ContactAttributes {
    phone: string
    phoneType: string
    sequence: number
    isOwner: boolean
    email: string
    patient?: PatientV1 | Parse.Pointer
}

const className = 'Contact';

export class Contact extends Parse.Object<ContactAttributes> {
    constructor(attributes: ContactAttributes) {
        super(className, attributes);
    }
}

Parse.Object.registerSubclass(className, Contact);

const schema = new Parse.Schema(className);

schema.addNumber('sequence')
schema.addString('phone')
schema.addString('phoneType')
schema.addString('email')
schema.addBoolean('isOwner')
schema.addPointer('patient', 'PatientV1')

export { schema as ContactSchema }