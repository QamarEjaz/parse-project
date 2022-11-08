FROM node:latest

RUN npm install nodemon -g

ENV CONSUMER_HOME /ascend-consumer

WORKDIR $CONSUMER_HOME

COPY * ./

RUN npm install

EXPOSE $PORT
ENV NODE_PATH .

CMD ["npm", "run", "start"]
