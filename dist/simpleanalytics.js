"use strict";
var analytics = require('./analytics');
var objectassign_1 = require('./objectassign');
var utils_1 = require('./utils');
var SimpleAPI = (function () {
    function SimpleAPI() {
    }
    SimpleAPI.prototype.init = function (token, endpoint) {
        if (typeof token === 'undefined') {
            throw new Error("You must pass your token when you call 'init'");
        }
        if (typeof token === 'string') {
            endpoint = endpoint || analytics.Endpoints.default;
            this.client = new analytics.Client({
                token: token,
                endpoint: endpoint
            });
        }
        else if (typeof token === 'object' && typeof token.sendEvent !== 'undefined') {
            this.client = token;
        }
        else {
            throw new Error("You must pass either your token or a valid object when you call 'init'");
        }
    };
    SimpleAPI.prototype.send = function (event, customData) {
        if (typeof this.client == 'undefined') {
            throw new Error("You must call init before sending an event");
        }
        customData = objectassign_1.default({}, {
            hash: window.location.hash
        }, customData);
        switch (event) {
            case 'pageview':
                this.client.sendViewEvent({
                    location: window.location.toString(),
                    referrer: document.referrer,
                    language: document.documentElement.lang,
                    title: document.title,
                    contentIdKey: utils_1.popFromObject(customData, 'contentIdKey'),
                    contentIdValue: utils_1.popFromObject(customData, 'contentIdValue'),
                    contentType: utils_1.popFromObject(customData, 'contentType'),
                    anonymous: utils_1.popFromObject(customData, 'anonymous'),
                    customData: customData
                });
                return;
            default:
                throw new Error("Event type: '" + event + "' not implemented");
        }
    };
    SimpleAPI.prototype.onLoad = function (callback) {
        if (typeof callback == 'undefined') {
            throw new Error("You must pass a function when you call 'onLoad'");
        }
        callback();
    };
    return SimpleAPI;
}());
exports.SimpleAPI = SimpleAPI;
var simpleAPI = new SimpleAPI();
exports.SimpleAnalytics = function (action) {
    var params = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        params[_i - 1] = arguments[_i];
    }
    var actionFunction = simpleAPI[action];
    if (actionFunction) {
        return actionFunction.apply(simpleAPI, params);
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.SimpleAnalytics;
//# sourceMappingURL=simpleanalytics.js.map