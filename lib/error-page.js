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

module.exports = buildErrorPage;

function buildErrorPage (context) {
	var env = (process.env.NODE_ENV || 'development');
	return [
		'<!DOCTYPE html>',
		'<html lang="en">',
		'<head>',
			'<meta charset="utf-8"/>',
			'<title>Internal Server Error (500)</title>',
			'<style>',
				buildErrorPageStyles(),
			'</style>',
		'</head>',
		'<body>',
			buildThundermoleComment(),
			'<h1 class="space center-box align-center">Internal Server Error (500)</h1>',
			buildErrorPageContent(env, context),
		'</body>',
		'</html>'
	].join('');
}

function buildErrorPageStyles () {
	return [
		'html { margin: 0; padding: 0; font-family: sans-serif; color: #444; line-height: 1.4; }',
		'body { margin: 0; padding: 160px 20px 20px 20px; background: #f7f7f7; }',
		'@media (max-width: 800px) { body { padding-top: 20px; } }',
		'h1, p, pre { font-weight: normal; margin: 0; }',
		'.space { margin-bottom: 20px; }',
		'.center-box { margin-left: auto; margin-right: auto; max-width: 500px; }',
		'.center-box-wide { max-width: 600px; }',
		'.align-center { text-align: center; }',
		'.code { padding: 20px; background: #eee; overflow: auto; }'
	].join('');
}

function buildErrorPageContent (env, context) {
	var content = [
		'<p class="space center-box align-center">',
			'The server encountered an internal error or misconfiguration ',
			'and was unable to complete your request.',
		'</p>'
	];
	if (env === 'development') {
		content.push(
			'<pre class="center-box center-box-wide code">',
				context.error.stack,
			'</pre>'
		);
	}
	return content.join('');
}

function buildThundermoleComment () {
	return [
		'<!--',
		'',
		'',
		'___ _  _ _  _ _  _ ___  ____ ____ _  _ ____ _    ____ ',
		' |  |__| |  | |\\ | |  \\ |___ |__/ |\\/| |  | |    |___ ',
		' |  |  | |__| | \\| |__/ |___ |  \\ |  | |__| |___ |___ ',
		'',
		'',
		'-->'
	].join('\n');
}
