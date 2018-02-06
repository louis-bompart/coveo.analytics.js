"use strict";
function popFromObject(object, key) {
    if (object) {
        var value = object[key];
        delete object[key];
        return value;
    }
}
exports.popFromObject = popFromObject;
//# sourceMappingURL=utils.js.map