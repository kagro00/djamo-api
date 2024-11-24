FROM node:20
WORKDIR /usr/src/app
COPY package*.json .
COPY index.js .
RUN npm install
CMD npm start
EXPOSE 4000
