FROM node:10

WORKDIR /

COPY package*.json /

RUN npm install

COPY . .

RUN mkdir -p /client/

WORKDIR /client/

COPY /client/package*.json /client/

RUN npm install

RUN npm run build

WORKDIR /

CMD [ "npm", "start" ]
