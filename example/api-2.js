'use strict';

var http = require('http');

http.createServer(handleRequest).listen(3002, handleStartup);

function handleRequest (request, response) {
	response.end(JSON.stringify({
		target: 'http://localhost:3004',
		append: {
			message: 'Hello from API-2'
		}
	}));
}

function handleStartup () {
	console.log('API-2 started');
}
