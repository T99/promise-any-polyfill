"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
Promise.any = (values) => __awaiter(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        let hasResolved = false;
        let iterableCount = 0;
        let rejectionReasons = [];
        const resolveOnce = (value) => {
            if (!hasResolved) {
                hasResolved = true;
                resolve(value);
            }
        };
        const rejectionCheck = (reason) => {
            rejectionReasons.push(reason);
            if (rejectionReasons.length >= iterableCount)
                reject(rejectionReasons);
        };
        for (let value of values) {
            iterableCount++;
            if (value.then !== undefined) {
                let promiseLikeValue = value;
                promiseLikeValue.then((result) => resolveOnce(result));
                if (value.catch !== undefined) {
                    let promiseValue = promiseLikeValue;
                    promiseValue.catch((reason) => rejectionCheck(reason));
                }
            }
        }
    });
});
//# sourceMappingURL=implementation.js.map