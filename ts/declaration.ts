/*
 * Created by Trevor Sears <trevor@trevorsears.com> (https://trevorsears.com/).
 * 10:37 PM -- October 28th, 2019.
 * Project: promise-any-polyfill
 */

export {};

/**
 * A type declaration for the upcoming `Promise.any` functionality as implemented in this package.
 * 
 * @author Trevor Sears <trevor@trevorsears.com> (https://trevorsears.com/)
 * @version v1.0.0
 * @since v0.1.0
 */
declare global {
	
	interface PromiseConstructor {
		
		any<T>(values: Iterable<T | PromiseLike<T>>): Promise<T>;
		
	}
	
}
