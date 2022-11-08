import * as Parse from 'parse/node';
import { ComplexTypeData, ModelBase } from './ModelBase';

export interface I_File {
    content: string
    fromX: number
    fromY: number
    width: number
    height: number
    ratio: number
}

// const className = '_File'
// const ascendEndpoint = 'users'

// export class _File extends Parse.File {
//     constructor (attributes: I_File) {
//         super(className, new Parse.ACL());
//     }
// }

// Parse.Object.registerSubclass(className, _File);

// const schema = new Parse.Schema(className);
// schema.addNumber('ascend_id')
// schema.addString('firstName')
// schema.addString('middleInitial')
// schema.addString('lastName')
// schema.addString('phone1')
// schema.addString('phone2')
// schema.addString('username')
// schema.addBoolean('enabled')
// schema.addNumber('timeout')
// schema.addBoolean('isProvider')
// schema.addArray('roles')
// schema.addPointer('currentLocation', 'LocationV1')
// schema.addString('lastModified')
// schema.addDate('startDate')
// schema.addString('name')
// schema.addString('status')

// export { schema }