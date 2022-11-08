FROM node:latest

ENV STREAM_HOME /ascend-streamapi

WORKDIR $STREAM_HOME

COPY * ./

RUN npm install

EXPOSE $PORT
ENV NODE_PATH .

CMD ["npm", "run", "start-amqp"]
