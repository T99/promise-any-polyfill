/*
 * Created by Trevor Sears <trevor@trevorsears.com> (https://trevorsears.com/).
 * 11:46 PM -- October 28th, 2019.
 * Project: promise-any-polyfill
 */

import "../implementation";

/**
 * Test cases for the Promise.any functionality implemented by this package.
 * 
 * @author Trevor Sears <trevor@trevorsears.com> (https://trevorsears.com/)
 * @version v1.0.0
 * @since v0.1.0
 */

function getTimedResolvingPromise<T>(msToResolve: number, resolveValue: PromiseLike<T> | T): Promise<T> {
	
	return new Promise<T>((resolve: (value: (PromiseLike<T> | T)) => void): void => {
		
		setTimeout((): void => resolve(resolveValue), msToResolve);
		
	});
	
}

function getTimedRejectingPromise<T>(msToReject: number, rejectValue?: T): Promise<T> {
	
	return new Promise<T>((resolve: (value: (PromiseLike<T> | T)) => void,
						   reject: (reason?: T) => void): void => {
		
		setTimeout((): void => reject(rejectValue), msToReject);
		
	});
	
}

test("The first resolving Promise should be acted upon.", 
	async (): Promise<void> => {
	
	let promises: Array<Promise<string>> = [
		getTimedResolvingPromise(20, "yes"),
		getTimedResolvingPromise(50, "nope"),
		getTimedResolvingPromise(65, "nuh-uh")
	];
	
	expect(await Promise.any<string>(promises)).toBe("yes");

});

test("Rejecting Promises should not effect the acted-upon value so long as some Promise resolves.", 
	async (): Promise<void> => {
	
	let promises: Array<Promise<string>> = [
		getTimedRejectingPromise(5, "ignore me"),
		getTimedRejectingPromise(50, "nuh-uh"),
		getTimedResolvingPromise(85, "yes")
	];
	
	expect(await Promise.any<string>(promises)).toBe("yes");
	
});

test("If all Promises reject, Promise.any should reject.", 
	async (): Promise<void> => {
	
	console.log(`hello world`);
		
	let promises: Array<Promise<string>> = [
		getTimedRejectingPromise(25, "ignore me"),
		getTimedRejectingPromise(50, "yes"),
		getTimedRejectingPromise(75, "nuh-uh")
	];
	
	return expect(Promise.any(promises)).rejects.toStrictEqual(["ignore me", "yes", "nuh-uh"]);
	
});

test("Given some non-Promise items, Promise.any should return the first of these.", 
	async (): Promise<void> => {
	
	let iterable: Array<any> = [
		getTimedRejectingPromise(5, "ignore me"),
		getTimedResolvingPromise(50, "yes"),
		"Hello there!",
		getTimedResolvingPromise(85, "nuh-uh")
	];
	
	expect(await Promise.any<string>(iterable)).toBe("Hello there!");
	
});
