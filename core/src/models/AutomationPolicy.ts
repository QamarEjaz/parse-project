import * as Parse from 'parse/node';
interface AutomationPolicyAttributes {
    name: string
    isActive: boolean
    executedCount: number
    source: Parse.Pointer
    criteria: Parse.Relation
    action: Parse.Relation
}

const className = 'AutomationPolicy';

export class AutomationPolicy extends Parse.Object<AutomationPolicyAttributes> {
    constructor(attributes: AutomationPolicyAttributes) {
        super(className, attributes);
    }
}

Parse.Object.registerSubclass(className, AutomationPolicy);

const schema = new Parse.Schema(className);

schema.addString('name')
schema.addBoolean('isActive')
schema.addNumber('executedCount')
schema.addPointer('source', 'Sources')
schema.addRelation('criteria', 'AutomationCriteria')
schema.addRelation('action', 'AutomationPolicyAction')

export { schema as AutomationPolicySchema }