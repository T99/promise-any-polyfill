export declare type TypeOrPromiseLike<T> = T | PromiseLike<T>;
export declare type ReturnResultOrPromiseLike<T> = T extends PromiseLike<infer U> ? U : T;
declare global {
    interface PromiseConstructor {
        any<T = any, R extends ReturnResultOrPromiseLike<T> = ReturnResultOrPromiseLike<T>>(values: Iterable<TypeOrPromiseLike<T>>): Promise<R>;
    }
}
