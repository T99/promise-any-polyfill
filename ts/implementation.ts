/*
 * Created by Trevor Sears <trevor@trevorsears.com> (https://trevorsears.com/).
 * 10:53 PM -- June 11th, 2019.
 * Project: promise-any-polyfill
 */

/**
 * An implementation of the upcoming `Promise.any` functionality.
 * 
 * @author Trevor Sears <trevor@trevorsears.com> (https://trevorsears.com/)
 * @version v1.0.0
 * @since v0.1.0
 */
Promise.any = <T>(values: Iterable<T | PromiseLike<T>>): Promise<T> => {
	
	return new Promise<T>((resolve: (value: T) => void, reject: (reason?: any) => void): void => {
		
		let hasResolved: boolean = false;
		let promiseLikes: Array<T | PromiseLike<T>> = [];
		let iterableCount: number = 0;
		let rejectionReasons: any[] = [];
		
		function resolveOnce(value: T): void {
			
			if (!hasResolved) {
				
				hasResolved = true;
				resolve(value);
				
			}
			
		}
		
		function rejectionCheck(reason?: any): void {
			
			rejectionReasons.push(reason);
			
			if (rejectionReasons.length >= iterableCount) reject(rejectionReasons);
			
		}
		
		for (let value of values) {
			
			iterableCount++;
			promiseLikes.push(value);
			
		}
		
		for (let promiseLike of promiseLikes) {
			
			if ((promiseLike as PromiseLike<T>)?.then !== undefined ||
				(promiseLike as Promise<T>)?.catch !== undefined) {
				
				(promiseLike as Promise<T>)
					?.then((result: T): void => resolveOnce(result))
					?.catch((error?: any): void => undefined);
				
				(promiseLike as Promise<T>)?.catch((reason?: any): void => rejectionCheck(reason));
				
			} else resolveOnce(promiseLike as T);
			
		}
		
	});
	
};
