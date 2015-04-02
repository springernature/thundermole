'use strict';

var sinon = require('sinon');

var clientRequest = {
	removeHeader: sinon.spy(),
	setHeader: sinon.spy()
};

var incomingMessage = {
	headers: {}
};

var serverResponse = {
	statusCode: 200,
	writeHead: sinon.spy(),
	end: sinon.spy()
};

var server = {
	listen: sinon.spy()
};
server.listen.bind = sinon.stub().returns(server.listen);

module.exports = {
	ClientRequest: sinon.stub().returns(clientRequest),
	createServer: sinon.stub().returns(server),
	IncomingMessage: sinon.stub().returns(incomingMessage),
	ServerResponse: sinon.stub().returns(serverResponse)
};
