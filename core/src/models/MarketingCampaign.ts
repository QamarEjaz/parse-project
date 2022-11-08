import * as Parse from 'parse/node';
import { ModelBase } from './ModelBase';

export interface IMarketingCampaign {
    contactType: string
    type: string
    log: Parse.Pointer
    patient: Parse.Pointer
    status: string
}

const className = 'MarketingCampaign'

export class MarketingCampaign extends Parse.Object {
    constructor(attributes: IMarketingCampaign) {
        super(className, attributes);
    }
}

Parse.Object.registerSubclass(className, MarketingCampaign);

const schema = new Parse.Schema(className);
schema.addString('ascend_id')
schema.addString('name')
schema.addString('shortName')
schema.addBoolean('active')
schema.addString('lastModified')
schema.addPointer('location', 'LocationV1')
schema.addString('migrationStatus')
schema.addObject('location_ascend')

export { schema as MarketingCampaignSchema }


