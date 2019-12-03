FROM node:10

WORKDIR /client/

COPY package*.json ./

RUN npm install
RUN npm run build

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]