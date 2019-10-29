/*
 *	Created by Trevor Sears <trevorsears.main@gmail.com>.
 *	11:46 PM -- October 28th, 2019.
 *	Project: promise-any-polyfill
 */

import "../implementation";

/**
 * Test cases for the Promise.any functionality implemented by this package.
 *
 * @author Trevor Sears <trevorsears.main@gmail.com>
 * @version v0.1.0
 * @since v0.1.0
 */

function getTimedResolvingPromise<T = any>(msToResolve: number, resolveValue?: T): Promise<T> {
	
	return new Promise<T>((resolve: (value?: (PromiseLike<T> | T)) => void): void => {
		
		setTimeout(() => resolve(resolveValue), msToResolve);
		
	});
	
}

function getTimedRejectingPromise<T = any>(msToReject: number, rejectValue?: T): Promise<T> {

	return new Promise<T>((resolve: (value?: (PromiseLike<T> | T)) => void,
						   reject: (reason?: T) => void): void => {

		setTimeout(() => resolve(rejectValue), msToReject);

	});

}

test("The first resolving Promise should be acted upon.", () => {
	
	let promises: Array<Promise<string>> = [
		getTimedResolvingPromise(20, "yes"),
		getTimedResolvingPromise(50, "nope"),
		getTimedResolvingPromise(65, "nuh-uh")
	];
	
	Promise.any<string>(promises).then((result: string) => {
		
		expect(result).toBe("yes");
		
	});

});

test("Rejecting Promises should not effect the acted-upon value so long as some Promise resolves.", () => {
	
	let promises: Array<Promise<string>> = [
		getTimedRejectingPromise(5, "ignore me"),
		getTimedResolvingPromise(50, "yes"),
		getTimedResolvingPromise(85, "nuh-uh")
	];
	
	Promise.any<string>(promises).then((result: string) => {
		
		expect(result).toBe("yes");
		
	});
	
});

test("If all Promises reject, Promise.any should reject.", () => {
	
	let promises: Array<Promise<string>> = [
		getTimedRejectingPromise(5, "ignore me"),
		getTimedResolvingPromise(50, "yes"),
		getTimedResolvingPromise(85, "nuh-uh")
	];
	
	Promise.any<string>(promises).then((result: string) => {
		
		fail("Promise.any resolved even though none of it's provided Promises resolved.");
		
	});
	
});

test("Given some non-Promise items, Promise.any should return the first of these.", () => {
	
	let iterable: Array<any> = [
		getTimedRejectingPromise(5, "ignore me"),
		getTimedResolvingPromise(50, "yes"),
		"Hello there!",
		getTimedResolvingPromise(85, "nuh-uh")
	];
	
	Promise.any<string>(iterable).then((result: string) => {
		
		expect(result).toBe("Hello there!");
		
	});
	
});