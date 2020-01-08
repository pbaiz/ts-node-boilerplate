# ts-node-boilerplate
NodeJS server boilerplate written in TypeScript.

## Features
- Auto generated swagger documentation.
- HTTP2 server.
- Mongo Database.
- Exception treatment.
- JWT authentication.
- Role base API security.
- Filter endpoint using query and field selection.
- Integration Tests.
- Pagination.
- Log error using log4js.
- Docker.

### Run using Docker
```bash
$ docker-compose up --build
``` 

### Run locally using Npm
```bash
$ npm install
$ npm start
``` 
Use Node v10.18.0 or bellow. There is a bug on a spdy http2 library for Node 11 and beyond: https://github.com/spdy-http2/handle-thing/pull/13 
