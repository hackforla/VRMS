FROM node:10

WORKDIR /client/

# COPY package*.json ./

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3000

# CMD [ "npm", "start" ]