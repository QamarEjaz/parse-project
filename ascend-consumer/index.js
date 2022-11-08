const Parse = require('parse/node');
const NATS = require('nats');
const _ = require('lodash');
const pkg = require('pg');
const { Client } = pkg;

function sleep(milliseconds) {
    const start = Date.now();
    while (Date.now() - start < milliseconds);
}

let activeStreamTables = {};

let pgConfig = {
    user: process.env.POSTGRES_USER || "postgres",
    host: process.env.DATABASE_HOST || "localhost",
    database: process.env.DATABASE_NAME || "parse_server_db",
    password: process.env.POSTGRES_PASSWORD || "postgres",
    port: process.env.DATABASE_PORT || 5432
};

console.log(pgConfig);

let pgClient = new Client(pgConfig);

const simpleTypes = {
    "AppointmentV1": [
        { columnName: 'start', shouldIgnore: false, type: 'Date' },
        { columnName: 'end', shouldIgnore: false, type: 'Date' },
        { columnName: 'created', shouldIgnore: false, type: 'Date' },
        { columnName: 'confirmed', shouldIgnore: false, type: 'Date' },
        { columnName: 'lastModified', shouldIgnore: false, type: 'Date' }
    ]
}

let complexTypes = {
    "AgingBalance": [],
    "AppointmentColorV1": [],
    "AppointmentHistoryV1": [],
    "AppointmentStatusHistoryV1": [],
    "AppointmentTaskV1": [],
    "AppointmentV1": [
        { columnName: 'labCaseDentalLab', className: 'DentalLabV1', shouldIgnore: false },
        { columnName: 'patientProcedures', className: 'PatientProcedureV1', shouldIgnore: false, isRelation: true },
        { columnName: 'practiceProcedures', className: 'PracticeProcedureV1', shouldIgnore: false, isRelation: true },
        { columnName: 'visits', className: 'VisitV1', shouldIgnore: false, isRelation: true },
        { columnName: 'provider', className: 'ProviderV1', shouldIgnore: false },
        { columnName: 'otherProvider', className: 'ProviderV1', shouldIgnore: false },
        { columnName: 'location', className: 'LocationV1', shouldIgnore: false },
        { columnName: 'patient', className: 'PatientV1', shouldIgnore: false },
        { columnName: 'operatory', className: 'OperatoryV1', shouldIgnore: false }
    ],
    "AssociatedConditionForProcedures": [],
    "Audit": [],
    "CarrierInsurPlanCoordinationOfBenefitsV1": [],
    "CarrierInsurancePlanV1": [
        { columnName: 'insuranceCarrier', className: 'InsuranceCarrierV1', shouldIgnore: false },
        { columnName: 'carrierPlanDeductible', className: 'CarrierPlanDeductibleV1', shouldIgnore: false },
    ],
    "CarrierPlanCopayExceptionV1": [],
    "CarrierPlanCoverageExceptionV1": [],
    "CarrierPlanDeductibleV1": [],
    "ClaimAttachment": [
        { columnName: 'document', className: 'Document', shouldIgnore: false },
        { columnName: 'insuranceClaim', className: 'InsuranceClaim', shouldIgnore: false }
    ],
    "ClinicalNote": [
        { columnName: 'additionalProvider', className: 'ProviderV1', shouldIgnore: false },
        { columnName: 'primarySignature', className: 'Signature', shouldIgnore: false },
        { columnName: 'additionalSignature', className: 'Signature', shouldIgnore: false },
        { columnName: 'provider', className: 'ProviderV1', shouldIgnore: false },
        { columnName: 'patient', className: 'PatientV1', shouldIgnore: false },
    ],
    "ClinicalNotePrompt": [],
    "ClinicalNotePromptUpdate": [],
    "ClinicalNoteTemplate": [],
    "ClinicalNoteTemplateUpdate": [],
    "ClinicalNoteTemplateUserFavorite": [],
    "ClinicalNoteUpdate": [],
    "ColorCategoryV1": [],
    "CoverageProcedureCopayV1": [],
    "CoverageProcedureRangeTemplate": [],
    "CoverageProcedureRangeV1": [],
    "DayNoteUpdateV1": [],
    "DayNoteV1": [],
    "DefaultPlanCoverage": [],
    "DeletedResult": [],
    "DentalLab": [],
    "DentalLabV1": [],
    "Document": [
        { columnName: 'ownerPatient', className: 'PatientV1', shouldIgnore: false },
        { columnName: 'ownerPerioExam', className: 'PerioExam', shouldIgnore: false },
        { columnName: 'ownerOrganization', className: 'Organization', shouldIgnore: false }
    ],
    "DocumentTag": [],
    "DocumentUpdate": [],
    "Error": [],
    "EventV1": [],
    "Exam": [],
    "FeeScheduleAssociationsV1": [],
    "FeeScheduleRangeUpdateV1": [],
    "FeeScheduleRangeV1": [],
    "FeeScheduleV1": [],
    "GlobalClinicalNotePrompt": [],
    "GlobalClinicalNoteTemplate": [],
    "GlobalInsuranceCarrierV1": [],
    "GlobalProcedureMappingRule": [],
    "GlobalProcedureV1": [],
    "ICD10": [],
    "ImageAttachment": [
        { columnName: 'insuranceClaim', className: 'InsuranceClaim', shouldIgnore: false }
    ],
    "InsurCarrierWithExcludedProcedureResWrap": [],
    "InsuranceCarrier": [],
    "InsuranceCarrierV1": [
        { columnName: 'globalInsuranceCarrier', className: 'GlobalInsuranceCarrierV1', shouldIgnore: false },
    ],
    "InsuranceCarrierWithExclProcedBulkResWrap": [],
    "InsuranceCarrierWithExcludedProcedure": [],
    "InsuranceClaim": [
        { columnName: 'procedures', className: 'PatientProcedureV1', shouldIgnore: false },
        { columnName: 'referral', className: 'ReferralSourceV1', shouldIgnore: false },
        { columnName: 'billingProvider', className: 'ProviderV1', shouldIgnore: false },
        { columnName: 'renderingProvider', className: 'ProviderV1', shouldIgnore: false },
        // TO BE FIGURED OUT 
        { columnName: 'insurancePayments', className: '????', shouldIgnore: true },
        { columnName: 'patient', className: 'PatientV1', shouldIgnore: false },
        { columnName: 'subscriber', className: 'PatientV1', shouldIgnore: false },
        { columnName: 'payToProvider', className: 'ProviderV1', shouldIgnore: false },
        { columnName: 'insuranceCarrier', className: 'InsuranceCarrierV1', shouldIgnore: false },
        { columnName: 'carrierInsurancePlan', className: 'CarrierInsurancePlanV1', shouldIgnore: false },
        { columnName: 'patientInsurancePlan', className: 'PatientInsurancePlan', shouldIgnore: false },
        { columnName: 'location', className: 'LocationV1', shouldIgnore: false },
        { columnName: 'imageAttachments', className: 'ImageAttachment', shouldIgnore: false },
        { columnName: 'claimAttachments', className: 'ClaimAttachment', shouldIgnore: false },
    ],
    "InsuranceClaimUpdate": [],
    "LocationClaimDefaults": [],
    "LocationHour": [],
    "LocationHourV1": [],
    "LocationPovertyLevel": [],
    "LocationV1": [
        { columnName: 'provider', className: 'ProviderV1', shouldIgnore: false, isRelation: false },
        { columnName: 'feeSchedule', className: 'FeeScheduleV1', shouldIgnore: false, isRelation: false }
    ],
    "LocationWithExcludedProcedure": [],
    "LocationWithExcludedProcedureBulkResWrap": [],
    "MedicalAlertCategoryV1": [],
    "MedicalAlertReactionV1": [],
    "MedicalAlertSeverityV1": [],
    "MedicalAlertUpdateV1": [],
    "MedicalAlertV1": [],
    "MissedAppointment": [],
    "MissedAppointmentV1": [],
    "OperatoryUpdateV1": [],
    "OperatoryV1": [
        { columnName: 'location', className: 'LocationV1', shouldIgnore: false },
    ],
    "Organization": [],
    "OrganizationConditionUpdateV1": [],
    "OrganizationConditionV1": [],
    "OrganizationLedgerRules": [],
    "OrganizationLedgerType": [],
    "Pagination": [],
    "PatientBookingAvailability": [],
    "PatientCalcV1": [],
    "PatientConditionUpdateV1": [],
    "PatientConditionV1": [
        { columnName: 'provider', className: 'ProviderV1', shouldIgnore: false },
        { columnName: 'chartedProvider', className: 'ProviderV1', shouldIgnore: false },
        { columnName: 'organizationCondition', className: 'OrganizationConditionV1', shouldIgnore: false },
        { columnName: 'patient', className: 'PatientV1', shouldIgnore: false }
    ],
    "PatientInsurancePlan": [
        { columnName: 'patient', className: 'PatientV1', shouldIgnore: false },
        { columnName: 'subscriberInsurancePlan', className: 'SubscriberInsurancePlan', shouldIgnore: false }
    ],
    "PatientMedicalAlertUpdateV1": [],
    "PatientMedicalAlertV1": [],
    "PatientNoteUpdateV1": [],
    "PatientNoteV1": [
        { columnName: 'patient', className: 'PatientV1', shouldIgnore: false }
    ],
    "PatientPaymentPlan": [],
    "PatientPrescriptionV1": [],
    "PatientProcedure": [],
    "PatientProcedureApptV1": [],
    "PatientProcedureCalc": [],
    "PatientProcedureCalcV1": [],
    "PatientProcedureGraphV1": [],
    "PatientProcedureUpdateV1": [],
    "PatientProcedureV1": [
        { columnName: 'location', className: 'LocationV1', shouldIgnore: false },
        { columnName: 'patient', className: 'PatientV1', shouldIgnore: false },
        { columnName: 'insuranceClaims', className: 'InsuranceClaim', shouldIgnore: false },
        { columnName: 'patientConditions', className: 'PatientConditionV1', shouldIgnore: false },
        { columnName: 'perioExams', className: 'PerioExam', shouldIgnore: false },
        // TO BE FIGURED OUT 
        { columnName: 'replacedBy', className: 'ProviderV1', shouldIgnore: false },
        { columnName: 'practiceProcedure', className: 'PracticeProcedureV1', shouldIgnore: false },
        { columnName: 'renderingProvider', className: 'ProviderV1', shouldIgnore: false },
        { columnName: 'treatmentPlannedProvider', className: 'ProviderV1', shouldIgnore: false }
    ],
    "PatientProcedureVoidV1": [],
    "PatientRecareUpdateV1": [],
    "PatientRecareV1": [
        { columnName: 'scheduledAppointment', className: 'AppointmentV1', shouldIgnore: false },
        { columnName: 'patient', className: 'PatientV1', shouldIgnore: false },
        { columnName: 'location', className: 'LocationV1', shouldIgnore: false },
        { columnName: 'user', className: '_User', shouldIgnore: false },
        { columnName: 'recareTemplate', className: 'RecareTemplateV1', shouldIgnore: false },
        { columnName: 'practiceProcedures', className: 'PracticeProcedureV1', shouldIgnore: false, isRelation: true }
    ],
    "PatientTooth": [],
    "PatientUpdateV1": [],
    "PatientV1": [
        { columnName: 'primaryProvider', className: 'ProviderV1', shouldIgnore: false },
        { columnName: 'discountPlan', className: 'FeeScheduleV1', shouldIgnore: false },
        { columnName: 'duplicateOfPatient', className: 'PatientV1', shouldIgnore: false },
        { columnName: 'referredByPatient', className: 'PatientV1', shouldIgnore: false },
        { columnName: 'referredByReferral', className: 'ReferralSourceV1', shouldIgnore: false },
        { columnName: 'primaryGuarantor', className: 'PatientV1', shouldIgnore: false },
        { columnName: 'secondaryGuarantor', className: 'PatientV1', shouldIgnore: false },
        { columnName: 'primaryContact', className: 'PatientV1', shouldIgnore: false },
        { columnName: 'secondaryContact', className: 'PatientV1', shouldIgnore: false },
        { columnName: 'preferredLocation', className: 'LocationV1', shouldIgnore: false },
        { columnName: 'referredPatients', className: 'PatientV1', shouldIgnore: false },
    ],
    "PeopleSet": [],
    "PerioExam": [
        { columnName: 'examCopy', className: 'PerioExam', shouldIgnore: false },
        { columnName: 'lastEditedPerioProbe', className: 'PerioProbe', shouldIgnore: false },
        { columnName: 'createdByUser', className: '_User', shouldIgnore: false },
        { columnName: 'provider', className: 'ProviderV1', shouldIgnore: false },
        { columnName: 'patient', className: 'PatientV1', shouldIgnore: false },
        { columnName: 'location', className: 'LocationV1', shouldIgnore: false },
    ],
    "PerioExamUpdate": [],
    "PerioProbe": [
        { columnName: 'perioExam', className: 'PerioExam', shouldIgnore: false },
    ],
    "PerioProbeUpdate": [],
    "PracticeProcedure": [],
    "PracticeProcedureBaseV1": [],
    "PracticeProcedureUpdateBridgeV1": [],
    "PracticeProcedureUpdateStandardV1": [],
    "PracticeProcedureUpdateV1": [],
    "PracticeProcedureV1": [
        { columnName: 'ponticProcedure', className: 'PracticeProcedureV1', shouldIgnore: false },
        { columnName: 'retainerProcedure', className: 'PracticeProcedureV1', shouldIgnore: false },
        { columnName: 'recareTemplate', className: 'RecareTemplateV1', shouldIgnore: false }
    ],
    "PrescriptionDrugCategoryUpdateV1": [],
    "PrescriptionDrugCategoryV1": [],
    "PrescriptionDrugUnitV1": [],
    "PrescriptionTemplateUpdateV1": [],
    "PrescriptionTemplateV1": [],
    "ProcedureCategory": [],
    "ProcedureCategoryV1": [],
    "ProcedureMapping": [],
    "ProcedureMappingV1": [],
    "ProductionCollection": [],
    "ProductionGross": [],
    "ProductionNetActual": [],
    "ProductionNetScheduled": [],
    "ProviderHour": [],
    "ProviderNumber": [
        { columnName: 'location', className: 'LocationV1', shouldIgnore: false }
    ],
    "ProviderV1": [
        { columnName: 'user', className: '_User', shouldIgnore: false },
        { columnName: 'insuranceCarriers', className: 'InsuranceCarrierV1', shouldIgnore: false },
        { columnName: 'feeSchedule', className: 'FeeScheduleV1', shouldIgnore: false },
        { columnName: 'location', className: 'LocationV1', shouldIgnore: false },
    ],
    "RecareTemplateUpdateV1": [],
    "RecareTemplateV1": [
        { columnName: 'practiceProcedures', className: 'PracticeProcedureV1', shouldIgnore: false, isRelation: true }
    ],
    "ReferralSourceV1": [],
    "SMSNumber": [],
    "ScheduleOpenings": [],
    "ScheduleTemplateApptReason": [],
    "ScheduleTemplateReasonV1": [
        { columnName: 'location', className: 'LocationV1', shouldIgnore: false, isRelation: false }
    ],
    "ScheduleTemplateV1": [
        { columnName: 'location', className: 'LocationV1', shouldIgnore: false, isRelation: false },
        { columnName: 'operatory', className: 'OperatoryV1', shouldIgnore: false, isRelation: false },
        { columnName: 'providers', className: 'ProviderV1', shouldIgnore: false, isRelation: false },
        { columnName: 'reasons', className: 'ScheduleTemplateReasonV1', shouldIgnore: false, isRelation: false }
    ],
    "Signature": [
        { columnName: 'user', className: '_User', shouldIgnore: false },
    ],
    "StreamAPIUsageQueueV1": [],
    "StreamAPIUsageV1": [],
    "SubscriberInsurancePlan": [
        { columnName: 'carrierInsurancePlan', className: 'CarrierInsurancePlanV1', shouldIgnore: false },
        { columnName: 'patient', className: 'PatientV1', shouldIgnore: false }
    ],
    "Token": [],
    "Tooth": [

    ],
    "TransactionAdjustment": [],
    "TransactionAdjustmentUpdate": [],
    "TransactionBase": [],
    "TransactionDistributionsBase": [],
    "TransactionFull": [],
    "TransactionInsurancePayment": [],
    "TransactionInsurancePaymentUpdate": [],
    "TransactionPatientPayment": [],
    "TransactionPatientPaymentBilling": [],
    "TransactionPatientPaymentUpdate": [],
    "TransactionProcedure": [],
    "TransactionTagV1": [],
    "TransferReason": [],
    "TxCaseAmountV1": [],
    "TxCaseCalcV1": [],
    "TxCaseCreateV1": [],
    "TxCaseUpdateV1": [],
    "TxCaseV1": [
        { columnName: 'user', className: '_User', shouldIgnore: false },
        { columnName: 'patient', className: 'PatientV1', shouldIgnore: false },
        { columnName: 'procedures', className: 'PatientProcedureV1', shouldIgnore: false },
        // TO BE FIGURED OUT
        { columnName: 'providerSignature', className: 'Signature', shouldIgnore: false },
        // TO BE FIGURED OUT
        { columnName: 'witnessSignature', className: 'Signature', shouldIgnore: false }
    ],
    "UserUpdate": [],
    "VisitUpdateV1": [],
    "VisitV1": [
        { columnName: 'procedures', className: 'PatientProcedureV1', shouldIgnore: false },
        { columnName: 'txCase', className: 'TxCaseV1', shouldIgnore: false },
        { columnName: 'appointment', className: 'AppointmentV1', shouldIgnore: false }
    ],
}

console.log(process.env.NATS, process.env.APP_ID, process.env.MASTER_KEY, process.env.PARSE_SERVER_URL)

let NATS_URL = process.env.NATS;
let MASTER_KEY_OPTION = { useMasterKey: true }

// NATS CONNECTION OBJECT
var nc;
var js;

function initialize() {
    Parse.initialize(
        process.env.APP_ID || 'APP_ID'
    );
    Parse.masterKey = process.env.MASTER_KEY || 'MASTER_KEY';
    Parse.serverURL = process.env.PARSE_SERVER_URL || "http://localhost:1337/parse";
    return Parse;
}

initialize();

const checkForCompletedMigrationTables = async () => {
    const config = await Parse.Config.get(MASTER_KEY_OPTION);
    const migrationStatus = config.get('migrationStatus');

    console.log(migrationStatus);

    for (var key in migrationStatus) {
        if (migrationStatus.hasOwnProperty(key) && migrationStatus[key] == "COMPLETE") {
            console.log(`Starting consumer for : ${key}`)
            await startStreamConsumer(key);
        }
    }
}

const setupUpdateColumnValueHandler = async () => {
    console.log('Setting up setupUpdateColumnValueHandler Listener')
    let opts = new NATS.consumerOpts();
    opts.durable("update-column-triggers");
    opts.manualAck();
    opts.ackExplicit();
    opts.deliverTo(NATS.createInbox());

    const jsm = await nc.jetstreamManager();
    const consumers = await jsm.consumers.list("update-column-triggers").next();

    if (consumers.length) {
        await jsm.consumers.delete("update-column-triggers", "update-column-triggers");
    }

    let startStopUpdateColumn = await js.subscribe("update.column", opts)

    let done = (async () => {
        let sub = null;
        for await (let m of startStopUpdateColumn) {
            let jc = NATS.JSONCodec();
            let incomingMessage = jc.decode(m.data);

            console.log(`\n update.column \n`)
            console.log(incomingMessage.className);
            console.log(incomingMessage.objectId);
            console.log(incomingMessage.column);
            console.log(incomingMessage.value);
            try {
                await pgClient.query(`Update public."${incomingMessage.className}" SET "${incomingMessage.column}"='${incomingMessage.value}' WHERE "objectId"='${incomingMessage.objectId}';`);
            } catch (error) {
                console.log(error);
            }
            m.ack();
        }
    })();
}

const setupAscendAfterCreateSyncHandler = async () => {
    console.log('Setting up setupAscendAfterCreateSyncHandler Listener')
    let opts = new NATS.consumerOpts();
    opts.durable("ascend-create-triggers");
    opts.manualAck();
    opts.ackExplicit();
    opts.deliverTo(NATS.createInbox());

    const jsm = await nc.jetstreamManager();
    const consumers = await jsm.consumers.list("ascend-create-triggers").next();

    if (consumers.length) {
        await jsm.consumers.delete("ascend-create-triggers", "ascend-create-triggers");
    }

    let startStopCreateSync = await js.subscribe("create.sync", opts)

    let done = (async () => {
        let sub = null;
        for await (let m of startStopCreateSync) {
            let jc = NATS.JSONCodec();
            let incomingMessage = jc.decode(m.data);

            console.log(`\n\n\n create.sync .... \n\n\n`)
            console.log(incomingMessage.className);
            console.log(incomingMessage.ascendObjectId);
            console.log(incomingMessage.localObjectId);

            while (true) {
                try {
                    await pgClient.query(`Delete from public."${incomingMessage.className}" Where "objectId"='${incomingMessage.ascendObjectId}';`);
                    await pgClient.query(`Update public."${incomingMessage.className}" SET "objectId"='${incomingMessage.ascendObjectId}', "ascend_id"='${incomingMessage.ascendObjectId}', "lastUpdatedBy"='ascend' WHERE "objectId"='${incomingMessage.localObjectId}';`);
                    await ascendToParse(incomingMessage.ascendObject, incomingMessage.className);

                    if (incomingMessage.className == 'PatientV1') {
                        await pgClient.query(`Update public."_Join:relatedPatients:PatientV1" SET "relatedId"='${incomingMessage.ascendObjectId}' where "relatedId"='${incomingMessage.localObjectId}'`)

                        console.log(`\n\n\n NEED TO UPDATE USERNAME AND CONTACT ENTRIES FOR PATIENT FROM : ${incomingMessage.localObjectId} TO : ${incomingMessage.ascendObjectId}`);
                        const contactQuery = new Parse.Query("Contact");
                        const contacts = await contactQuery.equalTo("patient", incomingMessage.localObjectId).find(MASTER_KEY_OPTION)
                        contacts.forEach(async (contact) => {
                            contact.set("patient", new Parse.Object("PatientV1", { id: incomingMessage.ascendObjectId }))
                            await contact.save(null, MASTER_KEY_OPTION);
                        });

                        try {
                            const userQuery = new Parse.Query("_User");
                            const user = await userQuery.equalTo("username", incomingMessage.localObjectId).first(MASTER_KEY_OPTION);
                            if (user) {
                                user.set("username", incomingMessage.ascendObjectId);
                                await user.save(null, MASTER_KEY_OPTION);
                            }
                        } catch (error) {
                            console.log(`\n\n _User does not exist for the patient`)
                            console.log(error);
                        }
                    }
                    break;
                } catch (error) {
                    console.log(error);
                }
            }
            m.ack();
        }
    })();

}

const setupTriggerListeners = async () => {
    console.log('Setting up Trigger Listeners for Consumers')
    let opts = new NATS.consumerOpts();
    opts.durable("me");
    opts.manualAck();
    opts.ackExplicit();
    opts.deliverTo(NATS.createInbox());

    const jsm = await nc.jetstreamManager();
    const consumers = await jsm.consumers.list("stream-triggers").next();

    if (consumers.length) {
        await jsm.consumers.delete("stream-triggers", "me");
    }

    let startStopConsumerTrigger = await js.subscribe("ascend.stream.consumer", opts)

    let done = (async () => {
        let sub = null;
        for await (let m of startStopConsumerTrigger) {
            let jc = NATS.JSONCodec();
            let incomingMessage = jc.decode(m.data);

            if (incomingMessage.command === 'start') {

                console.log("message received on ascend.stream.consumer :");
                console.log(incomingMessage);

                const config = await Parse.Config.get(MASTER_KEY_OPTION);
                const migrationStatusValue = config.get('migrationStatus');
                migrationStatusValue[incomingMessage.tableName] = 'COMPLETE';

                await Parse.Config.save({
                    migrationStatus: migrationStatusValue
                });

                console.log(`\n\nmigrationStatusValue : \n\n`);
                console.log(migrationStatusValue);
                console.log(`\n\n`);

                sub = await startStreamConsumer(incomingMessage.tableName);

            } else {
                if (sub !== null) {
                    sub.destroy();
                    sub = null;
                    console.log('subcscription STOPPED')
                } else {
                    console.log('subcscription is already NULL')
                }
            }
            m.ack();
        }
    })();
}

const connectComplexType = async (t, object) => {
    if (!t.shouldIgnore) {
        if (t.isRelation) {
            // deal with relations here
            let ascendValue = object.get(t.columnName + '_ascend')
            if (ascendValue?.length > 0) {
                console.log(`${t.className} > ${t.columnName} > do update Parse.Relation > ${ascendValue.length} total rleations to add`)
                let relation = object.relation(t.columnName);
                for (var y = 0; y < ascendValue.length; y++) {
                    let relationObj = ascendValue[y];
                    var ParseClass = Parse.Object.extend(t.className);
                    var pointerToParseClass = await new ParseClass();
                    pointerToParseClass.id = relationObj['id'];
                    relation.add(pointerToParseClass)
                }
                try {
                    await object.save(null, MASTER_KEY_OPTION);
                } catch (error) {
                    console.log(error.message)
                }
            }
        } else {
            // deal with pointers here
            let ascendValue = object.get(t.columnName + '_ascend')
            if (ascendValue?.id) {
                var ParseClass = Parse.Object.extend(t.className);
                var pointerToParseClass = await new ParseClass();
                pointerToParseClass.id = ascendValue['id'];

                object.set(t.columnName, pointerToParseClass)
                try {
                    await object.save(null, MASTER_KEY_OPTION)
                } catch (error) {
                    console.log(error.message)
                }
            }
        }
    }
}

const streamDeleteMessageHandler = async (orgId, locationId, domainType, payload) => {
    console.log(orgId, locationId, domainType, 'DELETE', payload.id);
    try {
        let DomainType = Parse.Object.extend(domainType);
        let domainTypeObject = new DomainType({
            id: payload.id
        });

        await domainTypeObject.destroy(MASTER_KEY_OPTION)

    } catch (error) {
        console.log(error.message);
    }
}

const ascendToParse = async (obj, domainType) => {
    const cloneObj = JSON.parse(JSON.stringify(obj));
    try {
        let DomainType = Parse.Object.extend(domainType);
        let domainTypeObject = new DomainType();

        obj['ascendSyncCompleted'] = true
        obj['lastUpdatedBy'] = 'ASCEND'
        obj['ascend_id'] = obj['id'];
        
        complexTypes[domainType]?.forEach((t) => {
            obj[`${t.columnName}_ascend`] = obj[t.columnName];
            delete obj[t.columnName];
        });

        for (let x = 0; x < simpleTypes[domainType]?.length; x++) {
            const t = simpleTypes[domainType][x];
            
            if (!!obj[t.columnName]) {
                obj[`${t.columnName}_ascend`] = typeof obj[t.columnName] === 'string' ? obj[t.columnName] : obj[t.columnName]?.toISOString();
                obj[t.columnName] = new Date(obj[t.columnName]);
            }
        }

        savedObject = await domainTypeObject.save(obj, MASTER_KEY_OPTION);

        complexTypes[domainType]?.forEach(async (t) => {
            await connectComplexType(t, savedObject)
        })

        savedObject.set('migrationStatus', 'COMPLETE');
        savedObject = await savedObject.save(obj, MASTER_KEY_OPTION);

        console.log(`SUCCESSFULLY UPDATED ${domainType} ${savedObject.id}\n\n `)
        return savedObject;
    } catch (error) {
        console.log(`${error.code} - ${error.message}`);
        if (error.code === 101) {
            // need to create an object that was missed during migration
            console.log(`RECEIVED AN UPDATE EVENT FOR A NON EXISTENT OBJECT FROM ASCEND - RUNNING CREATE NOW ...`);
            await streamCreateMessageHandler(null, null, domainType, {payload: cloneObj});
        } else {
            console.log(`\n\nERROR WHILE CONVERTING ASCEND OBJECT TO A PARSE OBJECT\n\n`)
            console.log(obj)
            console.log(`\n\n`)
            console.log(error)
            console.log(`\n\n`)
        }
    }
}

const streamUpdateMessageHandler = async (orgId, locationId, domainType, payload) => {
    console.log(orgId, locationId, domainType, 'UPDATE', payload.payload.id, payload.id);
    try {

        let obj = payload.payload;
        await ascendToParse(obj, domainType);

    } catch (error) {
        console.log(`${error.code} - ${error.message}`);
        if (error.code === 101) {
            // need to create an object that was missed during migration
            console.log(`RECEIVED AN UPDATE EVENT FOR A NON EXISTENT OBJECT FROM ASCEND - RUNNING CREATE NOW ...`);
            await streamCreateMessageHandler(orgId, locationId, domainType, payload);
        }
    }
}

const streamCreateMessageHandler = async (orgId, locationId, domainType, payload) => {
    try {
        console.log(orgId, locationId, domainType, 'CREATE', payload.payload.id, payload.id);
        var savedObject;
        try {
            let DomainType = Parse.Object.extend(domainType);
            let domainTypeObject = new DomainType();

            let obj = payload.payload;

            obj['ascendSyncCompleted'] = true
            obj['generatedBy'] = 'ascend'
            obj['lastUpdatedBy'] = 'ascend'

            // swap id with ascend_id
            obj['ascend_id'] = obj['id'];

            for (let x = 0; x < simpleTypes[domainType]?.length; x++) {
                const t = simpleTypes[domainType][x];
                if (!!obj[t.columnName]) {
                    obj[`${t.columnName}_ascend`] = new Date(obj[t.columnName]).toISOString();
                    obj[t.columnName] = new Date(obj[t.columnName]);
                }
            }

            for (var x = 0; x < complexTypes[domainType]?.length; x++) {
                const t = complexTypes[domainType][x];
                obj[`${t.columnName}_ascend`] = obj[t.columnName];
                delete obj[t.columnName];
            }

            try {
                await pgClient.query(`INSERT INTO public."${domainType}" ("objectId","createdAt","updatedAt") VALUES ('${obj['ascend_id']}',current_timestamp,current_timestamp);`).then(async (value) => {
                    savedObject = await domainTypeObject.save(obj, MASTER_KEY_OPTION);

                    for (var x = 0; x < complexTypes[domainType].length; x++) {
                        const t = complexTypes[domainType][x];
                        if (!t.shouldIgnore) {
                            console.log(`${domainType} connecting complex type -> ${t.columnName}`)
                            await connectComplexType(t, savedObject)
                        } else {
                            console.log(`${domainType} IGNORE CONNECTING COMPLEX TYPE -> ${t.columnName}`)
                        }
                    }
                    domainTypeObject.set('migrationStatus', 'COMPLETE');
                    savedObject = await domainTypeObject.save(obj, MASTER_KEY_OPTION);
                }).catch((error) => {
                    console.log(savedObject);
                    console.log(error);
                });
            } catch (error) {
                console.log(savedObject);
                console.log(error);
            }
        } catch (error) {
            console.log(savedObject);
            console.log(error.message);
        }
    } catch (error) {
        console.log(error);
    }
}

const processStreamMessages = async (orgId, locationId, domainType, operation, payload) => {
    try {
        switch (operation) {
            case 'CREATE':
                await streamCreateMessageHandler(orgId, locationId, domainType, payload)
                break;

            case 'UPDATE':
                await streamUpdateMessageHandler(orgId, locationId, domainType, payload)
                break;

            case 'DELETE':
                await streamDeleteMessageHandler(orgId, locationId, domainType, payload)
                break;

            default:
                console.log(`ILLEGAL OPERATION RECEIVED : ${operation}`);
                break;
        }
    } catch (error) {
        console.log(error);
    }
}

const startStreamConsumer = async (tableName) => {

    if (!activeStreamTables[tableName]) {
        let opts = new NATS.consumerOpts();
        opts.durable("me");
        opts.manualAck();
        opts.ackExplicit();
        opts.deliverTo(NATS.createInbox());

        try {

            const jsm = await nc.jetstreamManager();
            const consumers = await jsm.consumers.list(tableName).next();

            if (consumers.length) {
                await jsm.consumers.delete(tableName, "me");
            }

            let sub = await js.subscribe(`*.*.${tableName}.*`, opts)

            activeStreamTables[tableName] = sub;

            let done = (async () => {
                for await (let m of sub) {
                    let jc = NATS.JSONCodec();
                    let message = jc.decode(m.data);
                    console.log(`need to process message : ${message.domainType} ${message.operation}`);
                    try {
                        await processStreamMessages(message.orgId, message.locationId, message.domainType, message.operation, message.payload)
                    } catch (error) {
                        console.log(error);
                    }
                    m.ack();
                }
            })();
            return sub;
        } catch (error) {
            console.log(error)
            return error;
        }
    } else {
        console.log(`${tableName} subscription is already active ...`)
    }
}

(async () => {
    try {
        console.log('connecting postgres ...')
        while (true) {
            try {
                pgClient.connect();
                break;
            } catch (error) {
                console.log(error.message);
                sleep(2000);
            }
        }
        console.log('connecting nats ...')
        while (true) {
            try {
                nc = await NATS.connect({ servers: NATS_URL })
                js = nc.jetstream();
                break;
            } catch (error) {
                console.log(error.message);
                sleep(2000);
            }
        }
        console.log('Setup Trigger Listeners ...')
        while (true) {
            try {
                await setupAscendAfterCreateSyncHandler();
                await setupUpdateColumnValueHandler();
                await setupTriggerListeners();
                await checkForCompletedMigrationTables();
                break;
            } catch (error) {
                console.log(error);
                sleep(2000);
            }
        }
    } catch (error) {
        console.log(error.message);
    }
})();

let interval = setInterval(() => { }, 1000);