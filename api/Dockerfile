FROM node:latest

RUN npm i concurrently nodemon -g

ADD ./core ./core
WORKDIR /core
COPY ./core .
RUN npm install

ADD ./api ./api
WORKDIR /api
COPY ./api .
RUN npm install
RUN npm link

EXPOSE $PORT
ENV NODE_PATH .

CMD ["npm", "run", "dev"]