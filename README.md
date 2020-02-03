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
$ npm install --scripts-prepend-node-path=auto
$ npm start
```

### Run tests using Npm
```bash
$ npm install --scripts-prepend-node-path=auto
$ npm test
``` 
Use Node v10.18.0 or bellow. There is a bug on a spdy http2 library for Node 11 and beyond: https://github.com/spdy-http2/handle-thing/pull/13 

### Usage
After running the app you can access the documentation at: https://localhost:3000/api/doc 

If you not set the variable NODE_ENV, it will be set to 'develop' and will be created a user in mongo: {login:'admin', password:'admin123' roles:['admin']}. The admin user has admin role with access to all endpoints. Without the admin role you can only has permissions to use the endpoints:
- POST api/v1/authentication/signup
- POST api/v1/authentication/login
- GET api/v1/user/me

The admin user can add admin role to other users through:
- PUT api/v1/user/
