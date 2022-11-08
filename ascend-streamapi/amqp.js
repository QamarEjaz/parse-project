const NATS = require('nats');
const { getConfig } = require('./helpers');
const { connect } = require('amqplib');
const axios = require('axios');
const qs = require('qs');
const _ = require('lodash');

function sleep(milliseconds) {
  const start = Date.now();
  while (Date.now() - start < milliseconds);
}

const NATS_URL = process.env.NATS;

// NATS CONNECTION OBJECT
var nc;
var js;

var startStopConsumerTriggerSub;
var access_token;

var streamApiConnection;
var channel;

const deleteSet = new Set();
const createSet = new Set();
const updateHashSet = {};

// Before using the Stream API, please verify your account has the Stream API enabled.
// Contact the Dentrix Ascend team and verify you have access
// The Stream API is strongly recomended but sometimes it's not always enabled by default.

// To run this example:
// First edit the client_id and client_secret variables below with the values that you use

// Then open a command line from the the root diretory (where this file is) and type:
// npm i (assuming you have installed NodeJS)
// node example-amqp.js 

const client_id = process.env.ASCEND_CLIENT_ID;
const client_secret = process.env.ASCEND_CLIENT_SECRET;

// Example runs in prod / sandbox by default but possible to override to run in QA
let baseUrl = 'https://prod.hs1api.com';

const args = process.argv.slice(2);

if (args.length > 0 && args[0] === 'qa') {
  console.log('Running in qa');
  baseUrl = 'https://test.hs1api.com';
}

const apiTokenUrl = `${baseUrl}/oauth/client_credential/accesstoken`;

const bindQueues = async (channel, queueName, exchanges) => {
  // Bind the queue to to your exchange - otherwise no data will flow to your queue
  // Best practice is to only bind to routing keys that you will actually listen to - otherwise you will see quite a bit of
  // data flowing to your queue that you might throw away

  // RabbitMQ topic routing keys follow the pattern: 
  // orgId.locationId.domainType.operationType

  // In this example, you will only get messages for the OperatoryV1 and PatientV1 domain types

  await channel.bindQueue(queueName, exchanges, '*.*.AgingBalance.*');
  await channel.bindQueue(queueName, exchanges, '*.*.AppointmentColorV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.AppointmentHistoryV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.AppointmentStatusHistoryV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.AppointmentTaskV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.AppointmentV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.AssociatedConditionForProcedures.*');
  await channel.bindQueue(queueName, exchanges, '*.*.Audit.*');
  await channel.bindQueue(queueName, exchanges, '*.*.CarrierInsurPlanCoordinationOfBenefitsV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.CarrierInsurancePlanV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.CarrierPlanCopayExceptionV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.CarrierPlanCoverageExceptionV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.CarrierPlanDeductibleV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.ClaimAttachment.*');
  await channel.bindQueue(queueName, exchanges, '*.*.ClinicalNote.*');
  await channel.bindQueue(queueName, exchanges, '*.*.ClinicalNotePrompt.*');
  await channel.bindQueue(queueName, exchanges, '*.*.ClinicalNotePromptUpdate.*');
  await channel.bindQueue(queueName, exchanges, '*.*.ClinicalNoteTemplate.*');
  await channel.bindQueue(queueName, exchanges, '*.*.ClinicalNoteTemplateUpdate.*');
  await channel.bindQueue(queueName, exchanges, '*.*.ClinicalNoteTemplateUserFavorite.*');
  await channel.bindQueue(queueName, exchanges, '*.*.ClinicalNoteUpdate.*');
  await channel.bindQueue(queueName, exchanges, '*.*.ColorCategoryV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.CoverageProcedureCopayV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.CoverageProcedureRangeTemplate.*');
  await channel.bindQueue(queueName, exchanges, '*.*.CoverageProcedureRangeV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.DayNoteUpdateV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.DayNoteV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.DefaultPlanCoverage.*');
  await channel.bindQueue(queueName, exchanges, '*.*.DeletedResult.*');
  await channel.bindQueue(queueName, exchanges, '*.*.DentalLab.*');
  await channel.bindQueue(queueName, exchanges, '*.*.DentalLabV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.Document.*');
  await channel.bindQueue(queueName, exchanges, '*.*.DocumentTag.*');
  await channel.bindQueue(queueName, exchanges, '*.*.DocumentUpdate.*');
  await channel.bindQueue(queueName, exchanges, '*.*.Error.*');
  await channel.bindQueue(queueName, exchanges, '*.*.EventV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.Exam.*');
  await channel.bindQueue(queueName, exchanges, '*.*.FeeScheduleAssociationsV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.FeeScheduleRangeUpdateV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.FeeScheduleRangeV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.FeeScheduleV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.GlobalClinicalNotePrompt.*');
  await channel.bindQueue(queueName, exchanges, '*.*.GlobalClinicalNoteTemplate.*');
  await channel.bindQueue(queueName, exchanges, '*.*.GlobalInsuranceCarrierV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.GlobalProcedureMappingRule.*');
  await channel.bindQueue(queueName, exchanges, '*.*.GlobalProcedureV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.ICD10.*');
  await channel.bindQueue(queueName, exchanges, '*.*.ImageAttachment.*');
  await channel.bindQueue(queueName, exchanges, '*.*.InsurCarrierWithExcludedProcedureResWrap.*');
  await channel.bindQueue(queueName, exchanges, '*.*.InsuranceCarrier.*');
  await channel.bindQueue(queueName, exchanges, '*.*.InsuranceCarrierV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.InsuranceCarrierWithExclProcedBulkResWrap.*');
  await channel.bindQueue(queueName, exchanges, '*.*.InsuranceCarrierWithExcludedProcedure.*');
  await channel.bindQueue(queueName, exchanges, '*.*.InsuranceClaim.*');
  await channel.bindQueue(queueName, exchanges, '*.*.InsuranceClaimUpdate.*');
  await channel.bindQueue(queueName, exchanges, '*.*.LocationClaimDefaults.*');
  await channel.bindQueue(queueName, exchanges, '*.*.LocationHour.*');
  await channel.bindQueue(queueName, exchanges, '*.*.LocationHourV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.LocationPovertyLevel.*');
  await channel.bindQueue(queueName, exchanges, '*.*.LocationV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.LocationWithExcludedProcedure.*');
  await channel.bindQueue(queueName, exchanges, '*.*.LocationWithExcludedProcedureBulkResWrap.*');
  await channel.bindQueue(queueName, exchanges, '*.*.MedicalAlertCategoryV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.MedicalAlertReactionV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.MedicalAlertSeverityV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.MedicalAlertUpdateV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.MedicalAlertV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.MissedAppointment.*');
  await channel.bindQueue(queueName, exchanges, '*.*.MissedAppointmentV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.OperatoryUpdateV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.OperatoryV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.Organization.*');
  await channel.bindQueue(queueName, exchanges, '*.*.OrganizationConditionUpdateV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.OrganizationConditionV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.OrganizationLedgerRules.*');
  await channel.bindQueue(queueName, exchanges, '*.*.OrganizationLedgerType.*');
  await channel.bindQueue(queueName, exchanges, '*.*.Pagination.*');
  await channel.bindQueue(queueName, exchanges, '*.*.PatientBookingAvailability.*');
  await channel.bindQueue(queueName, exchanges, '*.*.PatientCalcV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.PatientConditionUpdateV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.PatientConditionV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.PatientInsurancePlan.*');
  await channel.bindQueue(queueName, exchanges, '*.*.PatientMedicalAlertUpdateV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.PatientMedicalAlertV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.PatientNoteUpdateV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.PatientNoteV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.PatientPaymentPlan.*');
  await channel.bindQueue(queueName, exchanges, '*.*.PatientPrescriptionV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.PatientProcedure.*');
  await channel.bindQueue(queueName, exchanges, '*.*.PatientProcedureApptV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.PatientProcedureCalc.*');
  await channel.bindQueue(queueName, exchanges, '*.*.PatientProcedureCalcV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.PatientProcedureGraphV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.PatientProcedureUpdateV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.PatientProcedureV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.PatientProcedureVoidV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.PatientRecareUpdateV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.PatientRecareV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.PatientTooth.*');
  await channel.bindQueue(queueName, exchanges, '*.*.PatientUpdateV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.PatientV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.PerioExam.*');
  await channel.bindQueue(queueName, exchanges, '*.*.PerioExamUpdate.*');
  await channel.bindQueue(queueName, exchanges, '*.*.PerioProbe.*');
  await channel.bindQueue(queueName, exchanges, '*.*.PerioProbeUpdate.*');
  await channel.bindQueue(queueName, exchanges, '*.*.PracticeProcedure.*');
  await channel.bindQueue(queueName, exchanges, '*.*.PracticeProcedureBaseV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.PracticeProcedureUpdateBridgeV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.PracticeProcedureUpdateStandardV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.PracticeProcedureUpdateV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.PracticeProcedureV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.PrescriptionDrugCategoryUpdateV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.PrescriptionDrugCategoryV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.PrescriptionDrugUnitV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.PrescriptionTemplateUpdateV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.PrescriptionTemplateV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.ProcedureCategory.*');
  await channel.bindQueue(queueName, exchanges, '*.*.ProcedureCategoryV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.ProcedureMapping.*');
  await channel.bindQueue(queueName, exchanges, '*.*.ProcedureMappingV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.ProductionCollection.*');
  await channel.bindQueue(queueName, exchanges, '*.*.ProductionGross.*');
  await channel.bindQueue(queueName, exchanges, '*.*.ProductionNetActual.*');
  await channel.bindQueue(queueName, exchanges, '*.*.ProductionNetScheduled.*');
  await channel.bindQueue(queueName, exchanges, '*.*.ProviderHour.*');
  await channel.bindQueue(queueName, exchanges, '*.*.ProviderNumber.*');
  await channel.bindQueue(queueName, exchanges, '*.*.ProviderV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.RecareTemplateUpdateV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.RecareTemplateV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.ReferralSourceV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.SMSNumber.*');
  await channel.bindQueue(queueName, exchanges, '*.*.ScheduleOpenings.*');
  await channel.bindQueue(queueName, exchanges, '*.*.ScheduleTemplateApptReason.*');
  await channel.bindQueue(queueName, exchanges, '*.*.ScheduleTemplateReasonV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.ScheduleTemplateV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.Signature.*');
  await channel.bindQueue(queueName, exchanges, '*.*.StreamAPIUsageQueueV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.StreamAPIUsageV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.SubscriberInsurancePlan.*');
  await channel.bindQueue(queueName, exchanges, '*.*.Token.*');
  await channel.bindQueue(queueName, exchanges, '*.*.Tooth.*');
  await channel.bindQueue(queueName, exchanges, '*.*.TransactionAdjustment.*');
  await channel.bindQueue(queueName, exchanges, '*.*.TransactionAdjustmentUpdate.*');
  await channel.bindQueue(queueName, exchanges, '*.*.TransactionBase.*');
  await channel.bindQueue(queueName, exchanges, '*.*.TransactionDistributionsBase.*');
  await channel.bindQueue(queueName, exchanges, '*.*.TransactionFull.*');
  await channel.bindQueue(queueName, exchanges, '*.*.TransactionInsurancePayment.*');
  await channel.bindQueue(queueName, exchanges, '*.*.TransactionInsurancePaymentUpdate.*');
  await channel.bindQueue(queueName, exchanges, '*.*.TransactionPatientPayment.*');
  await channel.bindQueue(queueName, exchanges, '*.*.TransactionPatientPaymentBilling.*');
  await channel.bindQueue(queueName, exchanges, '*.*.TransactionPatientPaymentUpdate.*');
  await channel.bindQueue(queueName, exchanges, '*.*.TransactionProcedure.*');
  await channel.bindQueue(queueName, exchanges, '*.*.TransactionTagV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.TransferReason.*');
  await channel.bindQueue(queueName, exchanges, '*.*.TxCaseAmountV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.TxCaseCalcV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.TxCaseCreateV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.TxCaseUpdateV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.TxCaseV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.UserUpdate.*');
  await channel.bindQueue(queueName, exchanges, '*.*.VisitUpdateV1.*');
  await channel.bindQueue(queueName, exchanges, '*.*.VisitV1.*');

  // todo - add any other domain types types (with the versions you are using) or you will not recieve those types of updates

  // It's very bad practice to bind to *.*.*.* unless you truly want to listen to all domain types
  // The system will be flooded with messages that are thrown away.
}

const publishMessageToNatsStream = async (subject, message) => {
  const jc = NATS.JSONCodec();
  await nc.publish(subject, jc.encode(message));
}

const startConsumer = async (channel, queueName) => {
  try {
    // Now that the queue is created and bound to the right exchange routing keys, you can
    // listen to the queue for any new data that flows through it
    await channel.consume(queueName, async (message) => {
      // console.log(`Received a message from stream API:`);

      // uncomment to see entire payload
      // console.log(JSON.stringify(message));

      // Useful fields in the payload
      const routingKey = _.get(message, 'fields.routingKey') || '';
      const [orgId, locationId, domainType, operation] = routingKey.split('.');
      // Here is the actual message payload
      const payload = JSON.parse(message.content.toString('UTF-8'));

      console.log(`routingKey=${routingKey} -> id : ${payload?.payload?.id}`);
      // console.log(`  domainType=${domainType}`); // probably a useful field to look at in a message

      const customMessage = {
        orgId: orgId,
        locationId: locationId,
        domainType: domainType,
        operation: operation,
        routingKey: routingKey,
        payload: payload
      }

      if (
        customMessage.domainType === 'PatientRecareV1' || 
        customMessage.domainType === 'PatientV1' || 
        customMessage.domainType === 'PatientProcedureV1' || 
        customMessage.domainType === 'PatientConditionV1' || 
        customMessage.domainType ===  'PerioExam' ||
        customMessage.domainType ===  'ClinicalNote' ||
        customMessage.domainType ===  'VisitV1' ||
        customMessage.domainType ===  'CarrierInsurancePlanV1'
      ) {
        const publishKey = customMessage.domainType + '_' + customMessage.payload.payload.id + '_' + customMessage.operation;

        if (customMessage.operation === 'CREATE' && !createSet.has(publishKey)) {
          if (!createSet.has(publishKey)) {
            createSet.add(publishKey);
            publishMessageToNatsStream(routingKey, customMessage)
          }
        } else if (customMessage.operation === 'UPDATE') {
          if (!updateHashSet[publishKey]) {
            updateHashSet[publishKey] = 1;
            publishMessageToNatsStream(routingKey, customMessage)
          } else if (updateHashSet[publishKey] % 21 === 0) {
            updateHashSet[publishKey] = updateHashSet[publishKey] + 1;
            publishMessageToNatsStream(routingKey, customMessage)
          } else {
            updateHashSet[publishKey] = updateHashSet[publishKey] + 1;
          }
        } else if (customMessage.operation === 'DELETE') {
          if (!deleteSet.has(publishKey)) {
            deleteSet.add(publishKey)
            publishMessageToNatsStream(routingKey, customMessage)
          }
        }
      } else {
        if (customMessage.operation === 'CREATE' || customMessage.operation === 'UPDATE' || customMessage.operation === 'DELETE') {
          await publishMessageToNatsStream(routingKey, customMessage)
        } else {
          console.log(`\n\n ILLEGAL OPERATION ${routingKey}`);
        }
      }

      channel.ack(message);
    });

    console.log('Listening to the stream api.  You need to use the normal rest api to save something like a Patient to see data flow.')


    // To see messages flow you will need to create, update or delete data in the Ascend rest api.
    // The initial example only listens to OperatoryV1 or PatientV1 domain models so you will need to test with those domain
    // types unless you change the queue bindings

    // The simplest way to use the rest api is via https://portal.hs1api.com/ but tools like Postman are easier to use for real development
    // Make sure that you are updating data for the exact same client_id that you used in this code example - or at least 
    // a client_id with access to the same organizations

    // Remember that messages only flow for PUT if anything has actually changed
  } catch (error) {
    console.log(`ERROR in startConsumer : `, error);
  }
}

const getAccessToken = async () => {
  try {
    // First get a normal api token just like you're using the normal Ascend Rest API
    const response = await axios({
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: qs.stringify({
        client_id: getConfig('client_id', client_id),
        client_secret: getConfig('client_secret', client_secret)
      }),
      url: apiTokenUrl,
      params: {
        'grant_type': 'client_credentials'
      }
    });
    const accessToken = response.data.access_token;
    console.log(`The api access_token is ${accessToken}`);

    return accessToken;
  } catch (error) {
    console.log(`Error while trying to get ACEND ACCESS TOKEN : \n`, error.message);
  }
}

const startQueue = async () => {

  try {
    console.log('running with client_id', getConfig('client_id', client_id));

    access_token = await getAccessToken();

    if (access_token) {
      // Put the access token and organization in the axios default headers so we don't need to keep sending it manually for all requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      // Now use the existing rest api to fetch a new streaming api url
      // (there is another endoint to get a secure web sockets stomp protocol stream api connection)
      const { data: { url: streamApiUrl, exchanges, queues, routingKeys, user } } = await axios.get(`${baseUrl}/ascend-streaming-api/url`);

      // console.log(routingKeys, user);

      // streamApiUrl contains all of the authentication and where the location of the stream api is

      // exchanges and queues are the rabbitmq exchange and queue patterns your client_id has access to
      // it's how we make sure client only access data they should be able to
      console.log(`Exchanges: ${exchanges}`);
      console.log(`Queues: ${queues}`);
      console.log(`Stream api url: ${streamApiUrl}`);

      // If you look at the streamApiUrl, you will notice that the user is actually a JWT that you can look at in jwt.io
      // It contains informatio about what you have access to in the Stream API - although much of that information is exposed
      // like the exchanges etc. shown above for convenience - so clients don't need to parse the JWT user manually



      // How to set up a queue to listen for creates, updates or deletes in the api

      // This example uses amqplib but other options exist for NodeJS and there are amqp libraries for most languages
      // Other libraries for other languages will do things a little differently but all share the same basic concepts of 
      // exchanges, queues, bindings etc.
      // https://www.rabbitmq.com/devtools.html

      // First create a connection
      streamApiConnection = await connect(streamApiUrl);

      // Next create a channel
      channel = await streamApiConnection.createChannel();

      // Now bind a queue that you can listen to
      // You should add a "." with something afterwards to name your queues
      // The names should be reused / consistent through your applications
      // You can only create a single queue with this name - queue names are globally unique (for your account)
      const queueName = `${queues}.testqueue-${Math.random().toString().substring(3, 10)}`;

      // Register for any connection errors
      streamApiConnection.on('error', async (err) => {
        console.error('Error in the main stream api connection: ', err);
        // TODO
        // Probably want some logging and a paused retry to re-establish the connection after a minute
        console.log(`\n\nWILL RE-ESTABLISH CONNECTION IN 10 SECONDS...\n\n`)
        setTimeout(() => {
          const sc = NATS.StringCodec();
          nc.publish('amqp.stream', sc.encode('start'));
        }, "10000")
      });

      // Assert the queue into existence
      // The queue in the example below will be deleted as soon as the process stops running
      // If you set durable: true, autoDelete: false, exclusive: false, the queue will be retained in the Ascend rabbitmq cluster
      // even after the process or connections stopped.  Messages will continue to accumulate in the queue until
      // you start consuming them again. Ascend will purge these queues after a period of time - otherwise we would run out of disk space.  
      // Be very careful how many unique queues (by the queueName) you create that are durable and make sure you responsibly listen to those queues
      // so you don't end up clogging up the rabbit cluster
      await channel.assertQueue(queueName, { durable: false, autoDelete: true, exclusive: true });

      await bindQueues(channel, queueName, exchanges);

      await startConsumer(channel, queueName);
    } else {
      console.log(`NO ACCESS TOKEN RECEIVED FROM ASCEND ...`);
    }

  } catch (error) {
    console.log(`Error in startQueue : \n`, error.message);
  }
}

const setupTriggerListeners = async (nc, js) => {
  const opts = new NATS.consumerOpts();
  opts.durable("amqp");
  opts.manualAck();
  opts.ackExplicit();
  opts.deliverTo(NATS.createInbox());

  js = nc.jetstream();
  startStopConsumerTriggerSub = await js.subscribe("amqp.stream", opts)
  console.log(`Setup Trigger Listeners Ready, to start populating amqp queue with ascend messages send start message on subject : amqp.stream`)
  const done = (async () => {
    for await (const m of startStopConsumerTriggerSub) {
      const sc = NATS.StringCodec();
      const command = sc.decode(m.data);

      console.log(`need to ${command} stream subsctiption ...`)
      m.ack();
      if (command === 'start') {
        console.log('START subcscription here ...')
        await startQueue();
      } else {
        console.log('STOP subcscription here ...')
      }
    }
  })();
}

(async () => {
  try {

    while (true) {
      try {
        console.log('trying to connect to nats server');
        nc = await NATS.connect({ servers: NATS_URL })
        js = nc.jetstream();
        await setupTriggerListeners(nc, js);
        break;
      } catch (error) {
        console.log(error.message);
        sleep(2000)
      }
    }

  }
  catch (err) {
    console.error('Error in the example program: ', err);
  }
})();
