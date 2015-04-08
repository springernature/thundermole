'use strict';

module.exports = timer;

function timer () {
	return {
		start: getTime(),
		end: function () {
			return getTime() - this.start;
		}
	};
}

function getTime () {
	return (new Date()).getTime();
}
