import os
import time
import asyncio
from nats.aio.client import Client as NATS
import debugpy
from nats.js import api


async def run(loop):

    nc = NATS()

    # Asyncio NATS client can be defined a number of event callbacks
    async def disconnected_cb():
        print("Got disconnected!")

    async def reconnected_cb():
        # See who we are connected to on reconnect.
        print("Got reconnected to {url}".format(url=nc.connected_url.netloc))
        js = nc.jetstream()
        streams = await js.streams_info()
        print(streams)

    async def error_cb(e):
        print("There was an error: {}".format(e))

    async def closed_cb():
        print("Connection is closed")

    await nc.connect(os.environ["NATS"], max_reconnect_attempts=100, disconnected_cb=disconnected_cb, reconnected_cb=reconnected_cb, error_cb=error_cb, closed_cb=closed_cb)
    js = nc.jetstream()

    # activeConsumersKeyValueConfig = api.KeyValueConfig(bucket="active-consumers-kv-bucket", history=1)
    # await js.create_key_value(config=activeConsumersKeyValueConfig)

    streamConfig = api.StreamConfig(retention="workqueue")

    # TODO : WE NEED TO USE PARAMS PASSED BY ENV VARIABLES
    tablesToStream = [
        "_User",
        "ClinicalNote",
        "PatientV1",
        "LocationV1",
        "ProviderNumber",
        "ProviderV1",
        "ReferralSourceV1",
        "FeeScheduleV1",
        "InsuranceCarrierV1",
        "GlobalInsuranceCarrierV1",
        "AppointmentV1",
        "VisitV1",
        "TxCaseV1",
        "OperatoryV1",
        "PatientProcedureV1",
        "PracticeProcedureV1",
        "CarrierInsurancePlanV1",
        "CarrierPlanDeductibleV1",
        "ClaimAttachment",
        "DentalLabV1",
        "Document",
        "ImageAttachment",
        "InsuranceClaim",
        "Organization",
        "OrganizationConditionV1",
        "PatientConditionV1",
        "PatientInsurancePlan",
        "PerioExam",
        "PerioProbe",
        "RecareTemplateV1",
        "SubscriberInsurancePlan",
        "ScheduleTemplateApptReason",
        "ScheduleTemplateReasonV1",
        "ScheduleTemplateV1",
        "Signature",
        "Tooth",
        "PatientRecareV1",
        "PatientNoteV1"
    ]

    # tablesToStream
    for tableName in tablesToStream:
        await js.add_stream(name=tableName, subjects=["*.*.{}.*".format(tableName)], config=streamConfig)

    await js.add_stream(name="amqp-stream-triggers", subjects=["amqp.stream"], config=streamConfig)
    await js.add_stream(name="update-column-triggers", subjects=["update.column"], config=streamConfig)
    await js.add_stream(name="ascend-create-triggers", subjects=["create.sync"], config=streamConfig)
    await js.add_stream(name="stream-triggers", subjects=["ascend.stream.consumer"], config=streamConfig)
    await js.add_stream(name="service-status-stream", subjects=["*.status.*"])
    await js.add_stream(name="logs-stream", subjects=["*.logs.*"], config=streamConfig)

    message = b'nats-queues initialized all required streams'
    await nc.publish("nats-queues.status.RUNNING", message)
    await nc.publish("nats-queues.logs.status", message)

    while True:
        await asyncio.sleep(1)


if __name__ == "__main__":
    print("NATS QUEUES SERVER is running now.")
    try:
        debugpy.listen(("0.0.0.0", 5556))
        print("debugger client listening at Port : 5556")

    except:
        print("unable to bind debugger at port : 5556")

    loop = asyncio.get_event_loop()
    loop.run_until_complete(run(loop))
    loop.run_forever()
    loop.close()
    print('done')
