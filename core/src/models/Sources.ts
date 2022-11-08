import * as Parse from 'parse/node';
interface SourcesAttributes {
    name: string
}

const className = 'Sources';

export class Sources extends Parse.Object<SourcesAttributes> {
    constructor(attributes: SourcesAttributes) {
        super(className, attributes);
    }
}

Parse.Object.registerSubclass(className, Sources);

const schema = new Parse.Schema(className);

schema.addString('name')

export { schema as SourcesSchema }