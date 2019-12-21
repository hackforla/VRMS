# FROM mhart/alpine-node:13

# WORKDIR /usr/src/app

# COPY /package*.json ./ 

# RUN npm install

# COPY . .

# WORKDIR /usr/src/app/client

# COPY /client/package*.json ./

# RUN npm install

# COPY /client .

# RUN npm run build

# WORKDIR /usr/src/app

# CMD [ "npm", "start" ]
