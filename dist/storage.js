"use strict";
var detector = require('./detector');
var cookieutils_1 = require('./cookieutils');
function getAvailableStorage() {
    if (detector.hasCookieStorage()) {
        return new CookieStorage();
    }
    if (detector.hasSessionStorage()) {
        return sessionStorage;
    }
    if (detector.hasLocalStorage()) {
        return localStorage;
    }
    return new NullStorage();
}
exports.getAvailableStorage = getAvailableStorage;
var CookieStorage = (function () {
    function CookieStorage() {
    }
    CookieStorage.prototype.getItem = function (key) {
        return cookieutils_1.Cookie.get(key);
    };
    CookieStorage.prototype.removeItem = function (key) {
        cookieutils_1.Cookie.erase(key);
    };
    CookieStorage.prototype.setItem = function (key, data) {
        cookieutils_1.Cookie.set(key, data);
    };
    return CookieStorage;
}());
exports.CookieStorage = CookieStorage;
var NullStorage = (function () {
    function NullStorage() {
    }
    NullStorage.prototype.getItem = function (key) { return ''; };
    NullStorage.prototype.removeItem = function (key) { };
    NullStorage.prototype.setItem = function (key, data) { };
    return NullStorage;
}());
exports.NullStorage = NullStorage;
//# sourceMappingURL=storage.js.map