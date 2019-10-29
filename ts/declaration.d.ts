/*
 *	Created by Trevor Sears <trevorsears.main@gmail.com>.
 *	10:37 PM -- October 28th, 2019.
 *	Project: promise-any-polyfill
 */

type ReturnResultOrPromiseLike<T> = T extends PromiseLike<infer U> ? U : T;

/**
 * A type declaration for the upcoming `Promise.any` functionality as implemented in this package.
 *
 * @author Trevor Sears <trevorsears.main@gmail.com>
 * @version v0.1.0
 * @since v0.1.0
 */
interface Promise<T> {
	
	any<T>(values: Iterable<T>): Promise<ReturnResultOrPromiseLike<T>>;
	
}