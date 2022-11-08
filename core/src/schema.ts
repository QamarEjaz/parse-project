import * as Parse from 'parse/node';

// Make Parse global to make sure that all the
// dependencies use the same instance.
global.Parse = Parse;

import { connect, JSONCodec, StringCodec } from "nats";
import { ModelBase } from "./models/ModelBase";
import { PeopleSet, PeopleSetSchema } from "./models/PeopleSet";
import { _User, _UserSchema } from './models/_User';
import { Contact, ContactSchema } from './models/Contact';

import { PatientV1, PatientV1Schema } from "./models/PatientV1";
import { LocationV1, LocationV1Schema } from "./models/LocationV1";
import { ProviderNumber, ProviderNumberSchema } from "./models/ProviderNumber";
import { ProviderV1, ProviderV1Schema } from "./models/ProviderV1";
import { ReferralSourceV1, ReferralSourceV1Schema } from "./models/ReferralSourceV1";
import { FeeScheduleV1, FeeScheduleV1Schema } from "./models/FeeScheduleV1";
import { InsuranceCarrierV1, InsuranceCarrierV1Schema } from './models/InsuranceCarrierV1';
import { GlobalInsuranceCarrierV1, GlobalInsuranceCarrierV1Schema } from './models/GlobalInsuranceCarrierV1';
import { AppointmentV1, AppointmentV1Schema } from './models/AppointmentV1';
import { OperatoryV1, OperatoryV1Schema } from './models/OperatoryV1';
import { PatientProcedureV1, PatientProcedureV1Schema } from './models/PatientProcedureV1';
import { PatientTypes, PatientTypesSchema } from "./models/PatientTypes";
import { PracticeProcedureV1, PracticeProcedureV1Schema } from './models/PracticeProcedureV1';
import { CarrierInsurancePlanV1, CarrierInsurancePlanV1Schema } from './models/CarrierInsurancePlanV1';
import { CarrierPlanDeductibleV1, CarrierPlanDeductibleV1Schema } from './models/CarrierPlanDeductibleV1';
import { ClaimAttachment, ClaimAttachmentSchema } from './models/ClaimAttachment';
import { ClinicalNote, ClinicalNoteSchema } from './models/ClinicalNote';
import { DentalLabV1, DentalLabV1Schema } from './models/DentalLabV1';
import { Document, DocumentSchema } from './models/Document';
import { ImageAttachment, ImageAttachmentSchema } from './models/ImageAttachment';
import { InsuranceClaim, InsuranceClaimSchema } from './models/InsuranceClaim';
import { Organization, OrganizationSchema } from './models/Organization';
import { OrganizationConditionV1, OrganizationConditionV1Schema } from './models/OrganizationConditionV1';
import { PatientConditionV1, PatientConditionV1Schema } from './models/PatientConditionV1';
import { PatientInsurancePlan, PatientInsurancePlanSchema } from './models/PatientInsurancePlan';
import { PatientNoteV1, PatientNoteV1Schema } from './models/PatientNoteV1';
import { PatientRecareV1, PatientRecareV1Schema } from './models/PatientRecareV1';
import { PerioExam, PerioExamSchema } from './models/PerioExam';
import { RecareTemplateV1, RecareTemplateV1Schema } from './models/RecareTemplateV1';
import { ScheduleTemplateApptReason, ScheduleTemplateApptReasonSchema } from './models/ScheduleTemplateApptReason';
import { ScheduleTemplateReasonV1, ScheduleTemplateReasonV1Schema } from './models/ScheduleTemplateReasonV1';
import { ScheduleTemplateV1, ScheduleTemplateV1Schema } from './models/ScheduleTemplateV1';
import { Signature, SignatureSchema } from './models/Signature';
import { SubscriberInsurancePlan, SubscriberInsurancePlanSchema } from './models/SubscriberInsurancePlan';
import { Tooth, ToothSchema } from './models/Tooth';
import { TxCaseV1, TxCaseV1Schema } from './models/TxCaseV1';
import { VirtualCall, VirtualCallSchema } from './models/VirtualCall';
import { VisitV1, VisitV1Schema } from './models/VisitV1';
import { SquareCustomer, SquareCustomerSchema } from './models/SquareCustomer';
import { SquareCard, SquareCardSchema } from './models/SquareCard';
import { Insurance, InsuranceSchema } from './models/Insurance';
import { ImportTrack, ImportTrackSchema } from './models/ImportTrack';
import { AppVersion, AppVersionSchema } from './models/AppVersion';
import { TreatmentPlan, TreatmentPlanSchema } from './models/TreatmentPlan';

import { Sources, SourcesSchema } from './models/Sources';
import { AutomationCriteria, AutomationCriteriaSchema } from './models/AutomationCriteria';
import { AutomationPolicy, AutomationPolicySchema } from './models/AutomationPolicy';
import { AutomationPolicyAction, AutomationPolicyActionSchema } from './models/AutomationPolicyAction';
import { AutomationPolicyActionParams, AutomationPolicyActionParamsSchema } from './models/AutomationPolicyActionParams';

const MASTER_KEY_OPTION = { useMasterKey: true }

const NATS_URL = process.env.NATS || 'localhost';

const INSURANCE_PROVIDERS = [
    "Delta Dental PPO",
    "Guardian",
    "Met Life",
    "Cigna",
    "Beam",
    "Principal",
    "United Health Care",
    "United Concordia",
    "Blue Cross",
    "Blue Shield",
    "Ameritas",
    "Humana",
    "Aetna",
    "Premier",
    "Metlife Ship (UC Berkeley)",
    "Other"
];

const INSURANCE_PROVIDERS_WITH_STATE = [
    "Delta Dental PPO",
    "Blue Cross",
    "Blue Shield"
];

const STATES = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
]

console.log('NATS_URL : ', NATS_URL);

// NATS CONNECTION OBJECT
var nc: any;
var js: any;

export interface SchemaListItem {
    schema: Parse.Schema,
    class: any,
    complexTypeDependencies?: string[]
}

function initialize() {
    Parse.initialize(
        process.env.APP_ID || 'APP_ID',
        process.env.JAVASCRIPT_KEY || 'JAVASCRIPT_KEY',
        process.env.MASTER_KEY || 'MASTER_KEY'
    );
    // @ts-ignore
    Parse.serverURL = process.env.SERVER_URL || "http://localhost:1337/parse";
    return Parse;
}

export default initialize;

const ascendTables = [
    // TODO: check. This is not the right place to include this
    // schema class name as this list is intended for Ascend only.
    "Sources",

    // TODO: check. This is not the right place to include this
    // schema class name as this list is intended for Ascend only.
    "AutomationCriteria",

    // TODO: check. This is not the right place to include this
    // schema class name as this list is intended for Ascend only.
    "AutomationPolicyAction",

    // TODO: check. This is not the right place to include this
    // schema class name as this list is intended for Ascend only.
    "AutomationPolicyActionParams",

    // TODO: check. This is not the right place to include this
    // schema class name as this list is intended for Ascend only.
    "AutomationPolicy",


    "TreatmentPlan",

    // TODO: check. This is not the right place to include this
    // schema class name as this list is intended for Ascend only.
    "VirtualCall",

    // TODO: check. This is not the right place to include this
    // schema class name as this list is intended for Ascend only.
    "AppVersion",

    // TODO: check. This is not the right place to include this
    // schema class name as this list is intended for Ascend only.
    "ImportTrack",

    // TODO: check. This is not the right place to include this
    // schema class name as this list is intended for Ascend only.
    "Insurance",

    // TODO: check. This is not the right place to include this
    // schema class name as this list is intended for Ascend only.
    "SquareCustomer",

    // TODO: check. This is not the right place to include this
    // schema class name as this list is intended for Ascend only.
    "SquareCard",

    // Ascend Tables
    "AgingBalance",
    "AppointmentColorV1",
    "AppointmentHistoryV1",
    "AppointmentStatusHistoryV1",
    "AppointmentTaskV1",
    "AppointmentV1",
    "AssociatedConditionForProcedures",
    "Audit",
    "CarrierInsurPlanCoordinationOfBenefitsV1",
    "CarrierInsurancePlanV1",
    "CarrierPlanCopayExceptionV1",
    "CarrierPlanCoverageExceptionV1",
    "CarrierPlanDeductibleV1",
    "ClaimAttachment",
    "ClinicalNote",
    "ClinicalNotePrompt",
    "ClinicalNotePromptUpdate",
    "ClinicalNoteTemplate",
    "ClinicalNoteTemplateUpdate",
    "ClinicalNoteTemplateUserFavorite",
    "ClinicalNoteUpdate",
    "ColorCategoryV1",
    "Contact",
    "CoverageProcedureCopayV1",
    "CoverageProcedureRangeTemplate",
    "CoverageProcedureRangeV1",
    "DayNoteUpdateV1",
    "DayNoteV1",
    "DefaultPlanCoverage",
    "DeletedResult",
    "DentalLab",
    "DentalLabV1",
    "Document",
    "DocumentTag",
    "DocumentUpdate",
    "Error",
    "EventV1",
    "Exam",
    "FeeScheduleAssociationsV1",
    "FeeScheduleRangeUpdateV1",
    "FeeScheduleRangeV1",
    "FeeScheduleV1",
    "GlobalClinicalNotePrompt",
    "GlobalClinicalNoteTemplate",
    "GlobalInsuranceCarrierV1",
    "GlobalProcedureMappingRule",
    "GlobalProcedureV1",
    "ICD10",
    "ImageAttachment",
    "InsurCarrierWithExcludedProcedureResWrap",
    "InsuranceCarrier",
    "InsuranceCarrierV1",
    "InsuranceCarrierWithExclProcedBulkResWrap",
    "InsuranceCarrierWithExcludedProcedure",
    "InsuranceClaim",
    "InsuranceClaimUpdate",
    "LocationClaimDefaults",
    "LocationHour",
    "LocationHourV1",
    "LocationPovertyLevel",
    "LocationV1",
    "LocationWithExcludedProcedure",
    "LocationWithExcludedProcedureBulkResWrap",
    "MedicalAlertCategoryV1",
    "MedicalAlertReactionV1",
    "MedicalAlertSeverityV1",
    "MedicalAlertUpdateV1",
    "MedicalAlertV1",
    "MissedAppointment",
    "MissedAppointmentV1",
    "OperatoryUpdateV1",
    "OperatoryV1",
    "Organization",
    "OrganizationConditionUpdateV1",
    "OrganizationConditionV1",
    "OrganizationLedgerRules",
    "OrganizationLedgerType",
    "Pagination",
    "PatientBookingAvailability",
    "PatientCalcV1",
    "PatientConditionUpdateV1",
    "PatientConditionV1",
    "PatientInsurancePlan",
    "PatientMedicalAlertUpdateV1",
    "PatientMedicalAlertV1",
    "PatientNoteUpdateV1",
    "PatientNoteV1",
    "PatientPaymentPlan",
    "PatientPrescriptionV1",
    "PatientProcedure",
    "PatientProcedureApptV1",
    "PatientProcedureCalc",
    "PatientProcedureCalcV1",
    "PatientProcedureGraphV1",
    "PatientProcedureUpdateV1",
    "PatientProcedureV1",
    "PatientProcedureVoidV1",
    "PatientRecareUpdateV1",
    "PatientRecareV1",
    "PatientTooth",
    "PatientUpdateV1",
    "PatientV1",
    "PatientTypes",
    "PeopleSet",
    "VirtualQueue",
    "PerioExam",
    "PerioExamUpdate",
    "PerioProbe",
    "PerioProbeUpdate",
    "PracticeProcedure",
    "PracticeProcedureBaseV1",
    "PracticeProcedureUpdateBridgeV1",
    "PracticeProcedureUpdateStandardV1",
    "PracticeProcedureUpdateV1",
    "PracticeProcedureV1",
    "PrescriptionDrugCategoryUpdateV1",
    "PrescriptionDrugCategoryV1",
    "PrescriptionDrugUnitV1",
    "PrescriptionTemplateUpdateV1",
    "PrescriptionTemplateV1",
    "ProcedureCategory",
    "ProcedureCategoryV1",
    "ProcedureMapping",
    "ProcedureMappingV1",
    "ProductionCollection",
    "ProductionGross",
    "ProductionNetActual",
    "ProductionNetScheduled",
    "ProviderHour",
    "ProviderNumber",
    "ProviderV1",
    "RecareTemplateUpdateV1",
    "RecareTemplateV1",
    "ReferralSourceV1",
    "SMSNumber",
    "ScheduleOpenings",
    "ScheduleTemplateApptReason",
    "ScheduleTemplateReasonV1",
    "ScheduleTemplateV1",
    "Signature",
    "StreamAPIUsageQueueV1",
    "StreamAPIUsageV1",
    "SubscriberInsurancePlan",
    "Token",
    "Tooth",
    "TransactionAdjustment",
    "TransactionAdjustmentUpdate",
    "TransactionBase",
    "TransactionDistributionsBase",
    "TransactionFull",
    "TransactionInsurancePayment",
    "TransactionInsurancePaymentUpdate",
    "TransactionPatientPayment",
    "TransactionPatientPaymentBilling",
    "TransactionPatientPaymentUpdate",
    "TransactionProcedure",
    "TransactionTagV1",
    "TransferReason",
    "TxCaseAmountV1",
    "TxCaseCalcV1",
    "TxCaseCreateV1",
    "TxCaseUpdateV1",
    "TxCaseV1",
    "UserUpdate",
    "VisitUpdateV1",
    "VisitV1",
]

const schemaList: SchemaListItem[] = [
    // TODO: check. This is not the right place to migrate this
    // schema as this list is intended for Ascend schemas only.
    {
        'schema': SourcesSchema,
        'class': Sources,
    },
    // TODO: check. This is not the right place to migrate this
    // schema as this list is intended for Ascend schemas only.
    {
        'schema': AutomationCriteriaSchema,
        'class': AutomationCriteria,
    },
    // TODO: check. This is not the right place to migrate this
    // schema as this list is intended for Ascend schemas only.
    {
        'schema': AutomationPolicySchema,
        'class': AutomationPolicy,
    },
    // TODO: check. This is not the right place to migrate this
    // schema as this list is intended for Ascend schemas only.
    {
        'schema': AutomationPolicyActionSchema,
        'class': AutomationPolicyAction,
    },
    // TODO: check. This is not the right place to migrate this
    // schema as this list is intended for Ascend schemas only.
    {
        'schema': AutomationPolicyActionParamsSchema,
        'class': AutomationPolicyActionParams,
    },
    {
        'schema': TreatmentPlanSchema,
        'class': TreatmentPlan,
    },

    // TODO: check. This is not the right place to migrate this
    // schema as this list is intended for Ascend schemas only.
    {
        'schema': VirtualCallSchema,
        'class': VirtualCall,
    },

    // TODO: check. This is not the right place to migrate this
    // schema as this list is intended for Ascend schemas only.
    {
        'schema': AppVersionSchema,
        'class': AppVersion,
    },

    // TODO: check. This is not the right place to migrate this
    // schema as this list is intended for Ascend schemas only.
    {
        'schema': ImportTrackSchema,
        'class': ImportTrack,
    },

    // TODO: check. This is not the right place to migrate this
    // schema as this list is intended for Ascend schemas only.
    {
        'schema': InsuranceSchema,
        'class': Insurance,
    },

    // TODO: check. This is not the right place to migrate this
    // schema as this list is intended for Ascend schemas only.
    {
        'schema': SquareCustomerSchema,
        'class': SquareCustomer,
    },

    // TODO: check. This is not the right place to migrate this
    // schema as this list is intended for Ascend schemas only.
    {
        'schema': SquareCardSchema,
        'class': SquareCard,
    },

    {
        'schema': PeopleSetSchema,
        'class': PeopleSet
    },
    {
        'schema': _UserSchema,
        'class': _User,
        'complexTypeDependencies': ['LocationV1']
    },
    {
        'schema': AppointmentV1Schema,
        'class': AppointmentV1,
        'complexTypeDependencies': [
            'DentalLabV1',
            'PatientProcedureV1',
            'PracticeProcedureV1',
            'VisitV1',
            'ProviderV1',
            'LocationV1',
            'PatientV1',
            'OperatoryV1'
        ]
    },
    {
        'schema': CarrierInsurancePlanV1Schema,
        'class': CarrierInsurancePlanV1,
        'complexTypeDependencies': ['FeeScheduleV1', 'InsuranceCarrierV1', 'CarrierPlanDeductibleV1']
    },
    {
        'schema': CarrierPlanDeductibleV1Schema,
        'class': CarrierPlanDeductibleV1,
        'complexTypeDependencies': []
    },
    {
        'schema': ClaimAttachmentSchema,
        'class': ClaimAttachment,
        'complexTypeDependencies': ['Document', 'InsuranceClaim']
    },
    {
        'schema': ClinicalNoteSchema,
        'class': ClinicalNote,
        'complexTypeDependencies': [
            'ProviderV1',
            'Signature',
            'Signature',
            'ProviderV1',
            'PatientV1'
        ]
    },
    {
        'schema': ContactSchema,
        'class': Contact
    },
    {
        'schema': DentalLabV1Schema,
        'class': DentalLabV1,
        'complexTypeDependencies': []
    },
    {
        'schema': DocumentSchema,
        'class': Document,
        'complexTypeDependencies': [
            'PatientV1',
            'PerioExam',
            'Organization'
        ]
    },
    {
        'schema': FeeScheduleV1Schema,
        'class': FeeScheduleV1,
        'complexTypeDependencies': []
    },
    {
        'schema': GlobalInsuranceCarrierV1Schema,
        'class': GlobalInsuranceCarrierV1,
        'complexTypeDependencies': []
    },
    {
        'schema': ImageAttachmentSchema,
        'class': ImageAttachment,
        'complexTypeDependencies': ['InsuranceClaim']
    },
    {
        'schema': InsuranceCarrierV1Schema,
        'class': InsuranceCarrierV1,
        'complexTypeDependencies': ['GlobalInsuranceCarrierV1']
    },
    {
        'schema': InsuranceClaimSchema,
        'class': InsuranceClaim,
        'complexTypeDependencies': [
            'PatientProcedureV1',
            'ReferralSourceV1',
            'ProviderV1',
            'ProviderV1',
            'PatientV1',
            'PatientV1',
            'ProviderV1',
            'InsuranceCarrierV1',
            'CarrierInsurancePlanV1',
            'PatientInsurancePlan',
            'LocationV1',
            'ImageAttachment',
            'ClaimAttachment'
        ]
    },
    {
        'schema': LocationV1Schema,
        'class': LocationV1,
        'complexTypeDependencies': ['ProviderV1', 'FeeScheduleV1']
    },
    {
        'schema': OperatoryV1Schema,
        'class': OperatoryV1,
        'complexTypeDependencies': ['LocationV1']
    },
    {
        'schema': OrganizationSchema,
        'class': Organization,
        'complexTypeDependencies': []
    },
    {
        'schema': OrganizationConditionV1Schema,
        'class': OrganizationConditionV1,
        'complexTypeDependencies': []
    },
    {
        'schema': PatientConditionV1Schema,
        'class': PatientConditionV1,
        'complexTypeDependencies': [
            'ProviderV1',
            'ProviderV1',
            'OrganizationConditionV1',
            'PatientV1'
        ]
    },
    {
        'schema': PatientInsurancePlanSchema,
        'class': PatientInsurancePlan,
        'complexTypeDependencies': ['PatientV1', 'SubscriberInsurancePlan']
    },
    {
        'schema': PatientNoteV1Schema,
        'class': PatientNoteV1,
        'complexTypeDependencies': ['PatientV1']
    },
    {
        'schema': PatientProcedureV1Schema,
        'class': PatientProcedureV1,
        'complexTypeDependencies': [
            'LocationV1',
            'PatientV1',
            'InsuranceClaim',
            'PatientConditionV1',
            'PerioExam',
            'PracticeProcedureV1',
            'ProviderV1',
            'ProviderV1'
        ]
    },
    {
        'schema': PatientRecareV1Schema,
        'class': PatientRecareV1,
        'complexTypeDependencies': [
            'AppointmentV1',
            'PatientV1',
            'LocationV1',
            '_User',
            'RecareTemplateV1',
            'PracticeProcedureV1'
        ]
    },
    {
        'schema': PatientV1Schema,
        'class': PatientV1,
        'complexTypeDependencies': [
            'ProviderV1',
            'FeeScheduleV1',
            'ReferralSourceV1',
            'LocationV1',
            'PatientV1'
        ]
    },

    {
        'schema': PatientTypesSchema,
        'class': PatientTypes,
        'complexTypeDependencies': [
            'PatientV1'
        ]
    },
    {
        'schema': PerioExamSchema,
        'class': PerioExam,
        'complexTypeDependencies': [
            'PerioExam',
            // 'PerioProbe',
            '_User',
            'ProviderV1',
            'PatientV1',
            'LocationV1'
        ]
    },

    // SPECIAL LOOP REQUIRED
    // {
    //     'schema': PerioProbeSchema,
    //      'class': PerioProbe
    // },

    {
        'schema': PracticeProcedureV1Schema,
        'class': PracticeProcedureV1,
        'complexTypeDependencies': [
            'PracticeProcedureV1',
            'PracticeProcedureV1',
            'RecareTemplateV1'
        ]
    },
    {
        'schema': ProviderNumberSchema,
        'class': ProviderNumber,
        'complexTypeDependencies': [
            'LocationV1',
            '_User'
        ]
    },
    {
        'schema': ProviderV1Schema,
        'class': ProviderV1,
        'complexTypeDependencies': [
            '_User',
            'InsuranceCarrierV1',
            'FeeScheduleV1',
            'LocationV1'
        ]
    },
    {
        'schema': RecareTemplateV1Schema,
        'class': RecareTemplateV1,
        'complexTypeDependencies': [
            'PracticeProcedureV1'
        ]
    },
    {
        'schema': ReferralSourceV1Schema,
        'class': ReferralSourceV1,
        'complexTypeDependencies': []
    },
    {
        'schema': ScheduleTemplateApptReasonSchema,
        'class': ScheduleTemplateApptReason,
        'complexTypeDependencies': ['LocationV1']
    },
    {
        'schema': ScheduleTemplateReasonV1Schema,
        'class': ScheduleTemplateReasonV1,
        'complexTypeDependencies': [
            'LocationV1'
        ]
    },
    {
        'schema': ScheduleTemplateV1Schema,
        'class': ScheduleTemplateV1,
        'complexTypeDependencies': [
            'LocationV1',
            'OperatoryV1',
            'ProviderV1',
            'ScheduleTemplateReasonV1']
    },
    {
        'schema': SignatureSchema,
        'class': Signature,
        'complexTypeDependencies': [
            '_User'
        ]
    },
    {
        'schema': SubscriberInsurancePlanSchema,
        'class': SubscriberInsurancePlan,
        'complexTypeDependencies': [
            'CarrierInsurancePlanV1',
            'PatientV1'
        ]
    },
    {
        'schema': ToothSchema,
        'class': Tooth,
        'complexTypeDependencies': []
    },
    {
        'schema': TxCaseV1Schema,
        'class': TxCaseV1,
        'complexTypeDependencies': [
            '_User',
            'PatientV1',
            'PatientProcedureV1'
        ]
    },
    {
        'schema': VisitV1Schema,
        'class': VisitV1,
        'complexTypeDependencies': [
            'PatientProcedureV1',
            'TxCaseV1',
            'AppointmentV1'
        ]
    },
];

initialize();

let getInitialMigrationStatusObject = () => {
    let migrationStatusObject: any = {};
    ascendTables.forEach((tableName) => {
        migrationStatusObject[tableName] = 'INCOMPLETE';
    });

    return migrationStatusObject;
}

let connectComplexSchemaTypes = async (list: SchemaListItem[], tablesMigrationDoneSet: Set<any>, tablesComplexTypesConnectionDoneSet: Set<any>) => {
    for (var x = 0; x < list.length; x++) {
        const item = list[x]
        try {
            const itemClass: ModelBase<any> = new item.class();
            if (tablesMigrationDoneSet.has(itemClass.className) &&
                !tablesComplexTypesConnectionDoneSet.has(itemClass.className) &&
                item.complexTypeDependencies &&
                item.complexTypeDependencies.every((cType) => tablesMigrationDoneSet.has(cType) || cType === itemClass.className)) {

                // trigger stream for each table as they are now ready

                const jc = JSONCodec();
                await nc.publish("ascend.stream.consumer", jc.encode({
                    command: 'start',
                    tableName: itemClass.className
                }));

                const config = await Parse.Config.get(MASTER_KEY_OPTION);
                const migrationStatusValue = config.get('migrationStatus');
                migrationStatusValue[itemClass.className] = 'COMPLETE';

                await Parse.Config.save({
                    migrationStatus: migrationStatusValue
                });

                tablesComplexTypesConnectionDoneSet.add(itemClass.className);
                await itemClass.connectComplexTypes();
            }
        } catch (err) {
            console.error(err);
        }
    }
    // trigger event queue message consumption to empty out the queue in order to achieve 100% syncronization
    // nats pub "ascend.stream.consumer" start

    // if (list.length === tablesComplexTypesConnectionDoneSet.size) {
    //     console.log(`\n\n\nALL MIGRATIONS ARE COMPLETE !!! NEED TO START CONSUMING EVENT MESSAGES NOW \n\n\n`)
    //     const sc = StringCodec();
    //     await nc.publish("ascend.stream.consumer", sc.encode('start'));
    // }
}

let migrateSchema = async (list: SchemaListItem[]) => {

    await Parse.Config.save({
        migrationStatus: getInitialMigrationStatusObject(),
        insuranceProviders: INSURANCE_PROVIDERS,
        insuranceProvidersWithState: INSURANCE_PROVIDERS_WITH_STATE,
        states: STATES
    });

    while (true) {
        try {
            console.log('trying to connect to nats server', NATS_URL);
            nc = await connect({ servers: NATS_URL })
            js = nc.jetstream();
            const sc = StringCodec();

            // turn on ascend socket for persisten queue fill up with events that are received during 
            // the migration process for later processing to acheive 100% syncronization

            nc.publish("amqp.stream", sc.encode('start'));

            break;

        } catch (error) {
            console.log(error);
        }
    }

    let tablesMigrationCount = 0;
    let tablesMigrationDoneSet = new Set();
    let tablesComplexTypesConnectionDoneSet = new Set();

    for (var x = 0; x < ascendTables.length; x++) {
        const tableName = ascendTables[x]
        console.log(`creating table : ${ascendTables[x]}`)

        const jc = JSONCodec();
        await nc.publish("ascend.stream.consumer", jc.encode({
            command: 'stop',
            tableName: tableName
        }));

        const tableSchema = new Parse.Schema(ascendTables[x]);
        try {
            await tableSchema.save();
        } catch (error: any) {
            console.log(error.message);
        }
    }

    for (var x = 0; x < list.length; x++) {
        const item = list[x]

        try {
            try {
                const oldSchema = await item.schema.get();
                await item.schema.update();
            } catch (err: any) {
                console.error(err);
                if (err.code === 103) {
                    await item.schema.save();
                }
            }

            const itemClass = new item.class();

            if (!(itemClass instanceof ModelBase)) {
                continue;
            }

            itemClass.syncWithAscend().then(async (newEntries: any) => {
                if (newEntries) {
                    tablesMigrationCount++;
                    tablesMigrationDoneSet.add(itemClass.className)
                    console.log(itemClass, ' ->> ', item, ' newEntries : ', newEntries.length, `\n\nTables Migration Count : ${tablesMigrationCount}\n`, `Total Tables to Migrate : ${list.length}\n\n`);
                    console.log(`\n\n${newEntries.length} NEW ENTRIES FOUND, TABLE COMPLEX TYPES NEED MIGRATION - ${itemClass.className}\n\n`)

                    console.log('\n\ntablesMigrationDoneSet : ', tablesMigrationDoneSet, '\n\n')
                    console.log('\n\ntablesComplexTypesConnectionDoneSet : ', tablesComplexTypesConnectionDoneSet, '\n\n')
                }

                connectComplexSchemaTypes(list, tablesMigrationDoneSet, tablesComplexTypesConnectionDoneSet);

                console.log('\n\ntablesMigrationDoneSet : ', tablesMigrationDoneSet, '\n\n')
                console.log('\n\ntablesComplexTypesConnectionDoneSet : ', tablesComplexTypesConnectionDoneSet, '\n\n')
            });
        } catch (err) {
            console.error(err);
        }
    }

    // FOR GETTING PROBES FROM EACH PERIOEXAM USING ITS ID
    // for (var x = 0; x < list.length; x++) {

    // }
}

migrateSchema(schemaList);
