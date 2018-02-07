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
function hasDocument() {
    return document !== null;
}
exports.hasDocument = hasDocument;
;
function hasDocumentLocation() {
    return hasDocument() && document.location !== null;
}
exports.hasDocumentLocation = hasDocumentLocation;
;
//# sourceMappingURL=detector.js.map