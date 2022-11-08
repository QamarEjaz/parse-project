import * as NodeParse from 'parse/node';
import * as Parse from 'parse';

export interface RoleAttributes {
    type: string
    name: string
    location: Location
  }
  
  const className = '_Role';
  export class Role extends Parse.Role<RoleAttributes> {
    constructor (attributes: RoleAttributes) {
        super(className, new Parse.ACL());
      }
  }
  
  Parse.Object.registerSubclass(className, Role);

const schema = new NodeParse.Schema(className);

schema.addString('type');
schema.addPointer('location', 'LocationV1');

export { schema as _RoleSchema }

