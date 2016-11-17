export function compareNumbers(first:number, second:number, decimals: number): number {
	const f = Math.round(first * Math.pow(10, decimals));
	const s = Math.round(second * Math.pow(10, decimals));
	if (f === s)
    	return 0;
	if (f < s)
		return -1;
	else return 1;
}

export function compareIgnoreCase(a:string, b:string): number {
  return a.toLowerCase().localeCompare(b.toLowerCase());
}

export function arraysEqual<T>(array1:Array<T>, array2:Array<T>) {
	// if the other array is a falsy value, return
	if (!array2)
		return false;

	// compare lengths - can save a lot of time
	if (array1.length != array2.length)
		return false;

	for (let i = 0, l=array1.length; i < l; i++) {
		// Check if we have nested arrays
		if (array1[i] instanceof Array && array2[i] instanceof Array) {
			// recurse into the nested arrays
			if (!arraysEqual<any>(<any>array1[i], <any>array2[i]))
				return false;
		}
		else if (array1[i] != array2[i]) {
			// Warning - two different object instances will never be equal: {x:20} != {x:20}
			return false;
		}
	}
	return true;
}
