# tedi-ai

## This repo will host code for all the backend services, we will be using shell scripts to bring up a number of dockerized services and maintain these files as project grows

* make sure you have docker installed on your local machine for this to work

** LINUX : installing docker https://docs.docker.com/engine/install/ubuntu/
** MAC OS : installing docker https://docs.docker.com/desktop/install/mac-install/
** install docker compose : `sudo apt install docker-compose`

* make sure you have docker installed on your local machine for this to work
* run `npm i concurrently nodemon -g`
* clone the repo and go to the `docker` directory and run the following command `npm i` and then run `npm run start:dev`

* you should now have the following containers : 

** `nats-queues` instance
** `dr-h-co-dashboard` instance
** `dr-h-co-mongo` instance
** `drhco-api-server` instance
** `dr-h-co-postgres` instance
** `drhco-ascend-streamapi` instance
** `drhco-ascend-consumer` instance
** `nats1` instance
** `nats2` instance
** `nats3` instance



