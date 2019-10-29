/*
 *	Created by Trevor Sears <trevorsears.main@gmail.com>.
 *	10:53 PM -- June 11th, 2019.
 *	Project: promise-any-polyfill
 */

type TypeOrPromiseLike<T> = T | PromiseLike<T>;

/**
 * An implementation of the upcoming `Promise.any` functionality.
 *
 * @author Trevor Sears <trevorsears.main@gmail.com>
 * @version v0.1.0
 * @since v0.1.0
 */
Promise.prototype.any = async <T, R extends ReturnResultOrPromiseLike<T>>(values: Iterable<T>): Promise<R> => {
	
	return new Promise<R>((resolve: (value?: (TypeOrPromiseLike<R>)) => void, reject: (reason?: any) => void): void => {
		
		let hasResolved: boolean = false;
		let iterableCount: number = 0;
		let rejectionReasons: any[] = [];
		
		const resolveOnce: (value?: (TypeOrPromiseLike<R>)) => void = (value?: (TypeOrPromiseLike<R>)): void => {
			
			if (!hasResolved) {
				
				hasResolved = true;
				resolve(value);
				
			}
			
		};
		
		const rejectionCheck: (reason: any) => void = (reason: any): void => {
			
			rejectionReasons.push(reason);
			
			if (rejectionReasons.length >= iterableCount) reject(rejectionReasons);
			
		};
		
		for (let value of values) {
			
			iterableCount++;
			
			if ((value as any).then !== undefined) {
				
				let promiseLikeValue: PromiseLike<TypeOrPromiseLike<R>> =
					value as unknown as PromiseLike<TypeOrPromiseLike<R>>;
				
				promiseLikeValue.then((result: TypeOrPromiseLike<R>): void => resolveOnce(result));
				
				if ((value as any).catch !== undefined) {
					
					let promiseValue: Promise<TypeOrPromiseLike<R>> = promiseLikeValue as Promise<TypeOrPromiseLike<R>>;
					
					promiseValue.catch((reason: any): void => rejectionCheck(reason));
					
				}
				
			}
			
		}
		
	});
	
};