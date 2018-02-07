"use strict";
var history_1 = require('./history');
require('whatwg-fetch');
exports.Version = 'v15';
exports.Endpoints = {
    default: 'https://usageanalytics.coveo.com',
    production: 'https://usageanalytics.coveo.com',
    dev: 'https://usageanalyticsdev.coveo.com',
    staging: 'https://usageanalyticsstaging.coveo.com'
};
;
function defaultResponseTransformer(response) {
    return response.json().then(function (data) {
        data.raw = response;
        return data;
    });
}
var Client = (function () {
    function Client(opts) {
        if (typeof opts === 'undefined') {
            throw new Error('You have to pass options to this constructor');
        }
        this.endpoint = opts.endpoint || exports.Endpoints.default;
        this.token = opts.token;
        this.version = opts.version || exports.Version;
    }
    Client.prototype.sendEvent = function (eventType, request) {
        return fetch(this.getRestEndpoint() + "/analytics/" + eventType, {
            method: 'POST',
            headers: this.getHeaders(),
            mode: 'cors',
            body: JSON.stringify(request),
            credentials: 'include'
        });
    };
    Client.prototype.sendSearchEvent = function (request) {
        return this.sendEvent('search', request).then(defaultResponseTransformer);
    };
    Client.prototype.sendClickEvent = function (request) {
        return this.sendEvent('click', request).then(defaultResponseTransformer);
    };
    Client.prototype.sendCustomEvent = function (request) {
        return this.sendEvent('custom', request).then(defaultResponseTransformer);
    };
    Client.prototype.sendViewEvent = function (request) {
        if (request.referrer === '') {
            delete request.referrer;
        }
        var store = new history_1.HistoryStore();
        var historyElement = {
            name: 'PageView',
            value: request.contentIdValue,
            time: JSON.stringify(new Date()),
        };
        store.addElement(historyElement);
        return this.sendEvent('view', request).then(defaultResponseTransformer);
    };
    Client.prototype.getVisit = function () {
        return fetch(this.getRestEndpoint() + "/analytics/visit")
            .then(defaultResponseTransformer);
    };
    Client.prototype.getHealth = function () {
        return fetch(this.getRestEndpoint() + "/analytics/monitoring/health")
            .then(defaultResponseTransformer);
    };
    Client.prototype.getRestEndpoint = function () {
        return this.endpoint + "/rest/" + this.version;
    };
    Client.prototype.getHeaders = function () {
        var headers = {
            'Content-Type': "application/json"
        };
        if (this.token) {
            headers['Authorization'] = "Bearer " + this.token;
        }
        return headers;
    };
    return Client;
}());
exports.Client = Client;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Client;
//# sourceMappingURL=analytics.js.map