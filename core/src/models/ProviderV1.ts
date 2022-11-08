import { ModelBase } from './ModelBase';
// import { ProviderNumber } from './ProviderNumber';

// export enum provider_v1_speciality { DENTALPUBLICHEALTH, DENTALSPECIALTY, DENTIST, DENTAL, ENDODONTICS, FEDERALLYQUALIFIEDHEALTHCENTER, GENERALPRACTICE, HYGIENIST, MULTISPECIALTY, ORTHODONTICS, ORALMAXILLOFACIALPATHOLOGY, ORALMAXILLOFACIALRADIOLOGY, ORALMAXILLOFACIALSURGERY, PEDIATRICDENTISTRY, PERIODONTICS, PROSTHODONTICS, SINGLESPECIALTY }
// export enum provider_v1_state { AA, AE, AP, AL, AK, AS, AZ, AR, CA, CO, CNMI, CT, DE, DC, FM, FL, FSM, GA, GU, HI, ID, IL, IN, IA, KS, KY, LA, ME, MD, MH, MA, MI, MN, MS, MO, MT, NE, NV, NH, NJ, NM, NY, NC, ND, MP, OH, OK, OR, PW, PA, PR, RI, SC, SD, TN, TX, UT, VT, VI, VA, WA, WV, WI, WY }
export interface IProviderV1 {
    ascend_id: string
    type: string
    firstName: string
    middleInitial: string
    lastName: string
    shortName: string
    npi: string
    color: string
    active: boolean
    stateId: string
    tin: string
    specialty: string
    isPrimaryProvider: boolean
    isNonPersonEntity: boolean
    title: string
    signatureOnFile: boolean
    address1: string
    address2: string
    city: string
    state: string
    postalCode: string
    providerNumbers: []
    insuranceCarriers: Parse.Relation
    feeSchedule: Parse.Pointer
    user: Parse.Pointer
    location: Parse.Pointer
    lastModified: string
    // INTERNAL FIELDS
    migrationStatus: string
}

const ascendEndpoint = '/v1/providers'
const complexTypes = [
    { columnName: 'user', className: '_User', shouldIgnore: false },
    { columnName: 'insuranceCarriers', className: 'InsuranceCarrierV1', shouldIgnore: false, isRelation: true },
    { columnName: 'feeSchedule', className: 'FeeScheduleV1', shouldIgnore: false },
    { columnName: 'location', className: 'LocationV1', shouldIgnore: false },
]

export class ProviderV1 extends ModelBase<IProviderV1> {
    static className = "ProviderV1";

    constructor(attributes: IProviderV1) {
        super(ProviderV1.className, attributes);
        this.useLastId = true;
        this.ascendEndpoint = ascendEndpoint;
        this.className = ProviderV1.className;
    }

    async connectComplexTypes() {
        await this.executeConnectComplexTypes(complexTypes, ProviderV1.className);
    }

    async syncWithAscend() {
        const newEntries = await this.getAllFromAscend(ascendEndpoint, complexTypes, ProviderV1);
        return newEntries;
    }

    public async updateInAscend(object: Parse.Object, ascendClient: any) {
        try {
            return await this.update(object, ascendClient);
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async createInAscend(object: Parse.Object, ascendClient: any) {
        try {
            return await this.create(object, ascendClient);
        } catch (error) {
            console.log(error);
        }
    }
}

Parse.Object.registerSubclass(
    ProviderV1.className,
    ProviderV1
);

export const ProviderV1Schema = new Parse.Schema(ProviderV1.className)
    .addString('ascend_id')
    .addString('type')
    .addString('firstName')
    .addString('middleInitial')
    .addString('lastName')
    .addString('shortName')
    .addString('npi')
    .addString('color')
    .addBoolean('active')
    .addString('stateId')
    .addString('tin')
    .addString('specialty')
    .addBoolean('isPrimaryProvider')
    .addBoolean('isNonPersonEntity')
    .addString('title')
    .addBoolean('signatureOnFile')
    .addString('address1')
    .addString('address2')
    .addString('city')
    .addString('state')
    .addString('postalCode')
    .addArray('providerNumbers')
    .addString('lastModified')
    .addRelation('insuranceCarriers', 'InsuranceCarrierV1')
    .addPointer('feeSchedule', 'FeeScheduleV1')
    .addPointer('user', '_User')
    .addPointer('location', 'LocationV1')
    .addObject('user_ascend')
    .addArray('insuranceCarriers_ascend')
    .addObject('feeSchedule_ascend')
    .addObject('location_ascend')
    .addString('migrationStatus')
    .addString('generatedBy', { required: true })
    .addString('lastUpdatedBy', { required: true });


