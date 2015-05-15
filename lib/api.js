'use strict';

var _ = require('underscore');
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
		error = (error || getApiResponseErrors(apiRequest, apiResponse, apiResponseBody));
		done(error, apiResponseBody);
	});
}

function getApiResponseErrors (apiRequest, apiResponse, apiResponseBody) {
	/* jshint maxcomplexity: false, maxlen: false */
	if (apiResponse.statusCode !== 200) {
		return new Error('API (' + apiRequest.url + ') responded with a non-200 status code');
	}
	if (apiResponseBody === null || typeof apiResponseBody !== 'object') {
		return new Error('API (' + apiRequest.url + ') responded with a non-object');
	}
	if (!_.isString(apiResponseBody.target) && !_.isString(apiResponseBody.redirect)) {
		return new Error(
			'API (' + apiRequest.url + ') response does not have a target or redirect property'
		);
	}
	if (apiResponseBody.redirect_type && [301, 302, 303].indexOf(apiResponseBody.redirect_type) === -1) {
		return new Error('API (' + apiRequest.url + ') response redirect_type property is invalid. Should be 301, 302, or 303');
	}
	return null;
}

function buildApiRequest (incomingRequest, routes) {
	var apiRequest = {
		method: 'GET',
		url: module.exports.buildApiRequestUrl(incomingRequest.url, routes),
		qs: {
			resource: parseUrl(incomingRequest.url).path
		},
		headers: {
			Accept: 'application/json'
		},
		json: true
	};
	if (incomingRequest.headers && incomingRequest.headers.cookie) {
		apiRequest.headers.Cookie = incomingRequest.headers.cookie;
	}
	return apiRequest;
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
