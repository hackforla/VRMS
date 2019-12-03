FROM node:10

WORKDIR /client/

# COPY package*.json ./

COPY . .

RUN npm install

EXPOSE 3000

CMD [ "npm", "run", "build" ]