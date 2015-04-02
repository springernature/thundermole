'use strict';

var parseUrl = require('url').parse;
var request = require('request');

module.exports = {
	get: get,
	buildApiRequest: buildApiRequest,
	buildApiRequestUrl: buildApiRequestUrl
};

function get (incomingRequest, routes, done) {
	var apiRequest = module.exports.buildApiRequest(incomingRequest, routes);
	request(apiRequest, function (error, apiResponse, apiResponseBody) {
		error = (error || getApiResponseErrors(apiResponse, apiResponseBody));
		done(error, apiResponseBody);
	});
}

function getApiResponseErrors (apiResponse, apiResponseBody) {
	if (apiResponse.statusCode !== 200) {
		return new Error('API responded with a non-200 status code');
	}
	if (apiResponseBody === null || typeof apiResponseBody !== 'object') {
		return new Error('API responded with a non-object');
	}
	if (typeof apiResponseBody.target !== 'string') {
		return new Error('API response does not have a target property');
	}
	return null;
}

function buildApiRequest (incomingRequest, routes) {
	return {
		url: module.exports.buildApiRequestUrl(incomingRequest.url, routes),
		method: 'GET',
		headers: {
			Accept: 'application/json'
		},
		json: true
	};
}

function buildApiRequestUrl (url, routes) {
	return (routes[resolveRouteName(url)] || routes.default);
}

function resolveRouteName (url) {
	var pathName = parseUrl(url).pathname;
	if (pathName) {
		return pathName.replace(/^\//, '').split('/').shift();
	}
}
