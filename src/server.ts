import app from './app';
import * as fs from 'fs';
import * as http2 from 'spdy';

const port = 3000; 

const serverOptions = {
	key: fs.readFileSync('cert/ssl.key'),
	cert: fs.readFileSync('cert/ssl.crt')
  };
const server = http2.createServer(serverOptions, app);
server.listen(port);
server.on('listening', () => {
	console.info(`ts-node-boilerplace listening on ${port}`);
});