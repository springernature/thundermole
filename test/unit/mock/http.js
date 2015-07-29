// This file is part of Thundermole.
//
// Thundermole is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Thundermole is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Thundermole.  If not, see <http://www.gnu.org/licenses/>.

'use strict';

var sinon = require('sinon');

var clientRequest = {
	removeHeader: sinon.spy(),
	setHeader: sinon.spy()
};

var incomingMessage = {
	headers: {},
	method: 'GET'
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
