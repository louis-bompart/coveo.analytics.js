"use strict";
function hasLocalStorage() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    }
    catch (e) {
        return false;
    }
}
exports.hasLocalStorage = hasLocalStorage;
;
function hasSessionStorage() {
    try {
        return 'sessionStorage' in window && window['sessionStorage'] !== null;
    }
    catch (e) {
        return false;
    }
}
exports.hasSessionStorage = hasSessionStorage;
;
function hasCookieStorage() {
    return navigator.cookieEnabled;
}
exports.hasCookieStorage = hasCookieStorage;
;
//# sourceMappingURL=detector.js.map