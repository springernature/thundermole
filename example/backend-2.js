'use strict';

var http = require('http');

http.createServer(handleRequest).listen(3004, handleStartup);

function handleRequest (request, response) {
	response.end([
		'<h1>This is Backend-2</h1>',
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

function handleStartup () {
	console.log('Backend-2 started');
}
