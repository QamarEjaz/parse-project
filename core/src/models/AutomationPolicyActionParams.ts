import * as Parse from 'parse/node';
interface AutomationPolicyActionParamsAttributes {
    name: string
    type: string
    value: string
}

const className = 'AutomationPolicyActionParams';

export class AutomationPolicyActionParams extends Parse.Object<AutomationPolicyActionParamsAttributes> {
    constructor(attributes: AutomationPolicyActionParamsAttributes) {
        super(className, attributes);
    }
}

Parse.Object.registerSubclass(className, AutomationPolicyActionParams);

const schema = new Parse.Schema(className);

schema.addString('name')
schema.addString('type')
schema.addString('value')

export { schema as AutomationPolicyActionParamsSchema }