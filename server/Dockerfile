FROM node:10

RUN npm install nodemon -g

RUN mkdir -p /srv/app/server/

WORKDIR /srv/app/server

COPY package*.json /srv/app/server/

RUN npm install

COPY . /srv/app/server/

# COPY --from=build /srv/app/client/ /srv/app/

# EXPOSE 4000

CMD [ "npm", "start" ]