import * as Parse from 'parse/node';
import { RoleDefination } from '../common/RoleDefinations';
import { LocationV1 } from './LocationV1';
import { ModelBase } from './ModelBase';
import { _User } from './_User';
interface PeopleSetAttributes {
    name: string
    features: RoleDefination[]
    locations?: Parse.Relation<PeopleSet, LocationV1>
    users?: Parse.Relation<PeopleSet, _User>
}

const className = 'PeopleSet';

export class PeopleSet extends Parse.Object{
    constructor(attributes: PeopleSetAttributes) {
        super(className, attributes);
    }
}

Parse.Object.registerSubclass(className, PeopleSet);

const schema = new Parse.Schema(className);
schema.addArray('features')
schema.addString('name')
schema.addRelation('locations', 'LocationV1')
schema.addRelation('users', '_User')

export { schema as PeopleSetSchema }