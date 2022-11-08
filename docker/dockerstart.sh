#!/bin/bash

if [ "$DATABASE_DEPLOYMENT" = "local" ]
then
      echo "\$DATABASE_DEPLOYMENT is local, need to run local ${DATABASE_TYPE} container."
      CONTAINERS_TO_RUN="-f docker-grafana.yml -f docker-parse.yml -f docker-ascend-streamapi.yml -f docker-ascend-consumer.yml -f docker-nats.yml -f docker-nats-queues.yml -f docker-${DATABASE_TYPE}.yml"
else
      echo "\$DATABASE_DEPLOYMENT is empty, using DATABASE_URI : ${DATABASE_URI}"
      CONTAINERS_TO_RUN="-f docker-grafana.yml -f docker-parse.yml -f docker-ascend-streamapi.yml -f docker-ascend-consumer.yml -f docker-nats.yml -f docker-nats-queues.yml"
fi

docker-compose -f docker-grafana.yml -f docker-parse.yml -f docker-mongo.yml -f docker-postgres.yml -f docker-ascend-streamapi.yml -f docker-ascend-consumer.yml -f docker-nats.yml -f docker-nats-queues.yml down

# docker rmi drhco_dr-h-co-api-server -f
# docker rmi drhco-api-server -f

# docker rmi drhco_nats-queues -f

docker rmi drhco_dr-h-co-ascend-streamapi -f
docker rmi drhco-ascend-streamapi -f

docker rmi drhco-ascend-consumer -f
docker rmi drhco_dr-h-co-ascend-consumer -f

docker-compose $CONTAINERS_TO_RUN -p='drhco' up  -d 