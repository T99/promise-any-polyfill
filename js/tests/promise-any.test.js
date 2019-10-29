"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../implementation");
function getTimedResolvingPromise(msToResolve, resolveValue) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(resolveValue), msToResolve);
    });
}
function getTimedRejectingPromise(msToReject, rejectValue) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(rejectValue), msToReject);
    });
}
test("The first resolving Promise should be acted upon.", () => {
    let promises = [
        getTimedResolvingPromise(20, "yes"),
        getTimedResolvingPromise(50, "nope"),
        getTimedResolvingPromise(65, "nuh-uh")
    ];
    Promise.any(promises).then((result) => {
        expect(result).toBe("yes");
    });
});
test("Rejecting Promises should not effect the acted-upon value so long as some Promise resolves.", () => {
    let promises = [
        getTimedRejectingPromise(5, "ignore me"),
        getTimedResolvingPromise(50, "yes"),
        getTimedResolvingPromise(85, "nuh-uh")
    ];
    Promise.any(promises).then((result) => {
        expect(result).toBe("yes");
    });
});
test("If all Promises reject, Promise.any should reject.", () => {
    let promises = [
        getTimedRejectingPromise(5, "ignore me"),
        getTimedResolvingPromise(50, "yes"),
        getTimedResolvingPromise(85, "nuh-uh")
    ];
    Promise.any(promises).then((result) => {
        fail("Promise.any resolved even though none of it's provided Promises resolved.");
    });
});
test("Given some non-Promise items, Promise.any should return the first of these.", () => {
    let iterable = [
        getTimedRejectingPromise(5, "ignore me"),
        getTimedResolvingPromise(50, "yes"),
        "Hello there!",
        getTimedResolvingPromise(85, "nuh-uh")
    ];
    Promise.any(iterable).then((result) => {
        expect(result).toBe("Hello there!");
    });
});
//# sourceMappingURL=promise-any.test.js.map