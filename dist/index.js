"use strict";
var analytics = require('./analytics');
exports.analytics = analytics;
var SimpleAnalytics = require('./simpleanalytics');
exports.SimpleAnalytics = SimpleAnalytics;
var history = require('./history');
exports.history = history;
var donottrack = require('./donottrack');
exports.donottrack = donottrack;
var storage = require('./storage');
exports.storage = storage;
var promise = window['Promise'];
if (!(promise instanceof Function)) {
    require('es6-promise').polyfill();
}
//# sourceMappingURL=index.js.map