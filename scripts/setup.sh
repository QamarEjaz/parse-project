#!/bin/bash

docker kill $(docker ps -q)
cd ..
npm i 

cd ./core
npm i 
npm run build

cd ../api
npm i 
npm run build

cd ../crm-frontend
npm i

cd ../docker
npm i 

