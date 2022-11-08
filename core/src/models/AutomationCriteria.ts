import * as Parse from 'parse/node';
interface AutomationCriteriaAttributes {
    key: string
    keyType: string
    operator: string
    value: string
    priority: number
}

const className = 'AutomationCriteria';

export class AutomationCriteria extends Parse.Object<AutomationCriteriaAttributes> {
    constructor(attributes: AutomationCriteriaAttributes) {
        super(className, attributes);
    }
}

Parse.Object.registerSubclass(className, AutomationCriteria);

const schema = new Parse.Schema(className);

schema.addString('key')
schema.addString('keyType')
schema.addString('operator')
schema.addString('value')
schema.addNumber('priority')

export { schema as AutomationCriteriaSchema }