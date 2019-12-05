FROM mhart/alpine-node:13

WORKDIR /

COPY . . 

RUN npm install

RUN mkdir -p /client/

WORKDIR /client/

COPY /client/package*.json /client/

RUN npm install

RUN npm run build

WORKDIR /

CMD [ "npm", "start" ]
