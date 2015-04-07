'use strict';

var http = require('http');

http.createServer(handleRequest).listen(3001, handleStartup);

function handleRequest (request, response) {
	response.end(JSON.stringify({
		target: 'http://localhost:3003',
		append: {
			message: 'Hello from API-1'
		}
	}));
}

function handleStartup () {
	console.log('API-1 started');
}
