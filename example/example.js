'use strict';

var http = require('http');
var parseUrl = require('url').parse;

var server = http.createServer(handleRequest);

server.listen(3002, function () {
	console.log('Example example application started');
});

function handleRequest (request, response) {
	if (parseUrl(request.url).pathname === '/api' && request.method === 'GET') {
		return handleApiRequest(request, response);
	}
	return handleWebRequest(request, response);
}

function handleApiRequest (request, response) {
	response.end(JSON.stringify({
		target: 'http://localhost:3002',
		append: {
			user_token: '123456',
			some_other_example_stuff: true
		}
	}));
}

function handleWebRequest (request, response) {
	response.end([
		'<h1>This is Example</h1>',
		'<p>',
			'<b>X-Proxy-Appended-Data Header:</b><br/>',
			'<pre>',
				JSON.stringify(
					JSON.parse(request.headers['x-proxy-appended-data'] || null),
					null,
					'    '
				),
			'</pre>',
		'</p>'
	].join(''));
}
