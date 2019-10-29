/*
 *	Created by Trevor Sears <trevorsears.main@gmail.com>.
 *	10:37 PM -- October 28th, 2019.
 *	Project: promise-any-polyfill
 */

export type TypeOrPromiseLike<T> = T | PromiseLike<T>;
export type ReturnResultOrPromiseLike<T> = T extends PromiseLike<infer U> ? U : T;

/**
 * A type declaration for the upcoming `Promise.any` functionality as implemented in this package.
 *
 * @author Trevor Sears <trevorsears.main@gmail.com>
 * @version v0.1.0
 * @since v0.1.0
 */
declare global {
	
	interface PromiseConstructor {
		
		any<T>(values: Iterable<TypeOrPromiseLike<T>>): Promise<ReturnResultOrPromiseLike<T>>;
		
	}
	
}