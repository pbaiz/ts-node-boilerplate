FROM node:10.18.0-alpine

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY package.json ./
RUN npm install

COPY . ./

RUN npm run predebug

EXPOSE 3000

CMD npm start