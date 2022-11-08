import * as Parse from 'parse/node';
interface AutomationPolicyActionAttributes {
    action: string
    params: Parse.Relation
}

const className = 'AutomationPolicyAction';

export class AutomationPolicyAction extends Parse.Object<AutomationPolicyActionAttributes> {
    constructor(attributes: AutomationPolicyActionAttributes) {
        super(className, attributes);
    }
}

Parse.Object.registerSubclass(className, AutomationPolicyAction);

const schema = new Parse.Schema(className);

schema.addString('action')
schema.addRelation('params', 'AutomationPolicyActionParams')

export { schema as AutomationPolicyActionSchema }