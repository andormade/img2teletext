export function create2dArray(rows: number, cols: number, filler: mixed): array {
	return new Array(rows).fill(null).map(() => {
		return new Array(cols).fill(filler);
	});
}

export function forEach2d(arr: array, callback: any): void {
	for (let row = 0; row < arr.length; row++) {
		for (let col = 0; col < arr[row].length; col++) {
			callback(row, col);
		}
	}
}

export function copy2dArray(arr: array): array {
	let newArr = [];
	for (let row = 0; row < arr.length; row++) {
		newArr[row] = [...arr[row]];
	}
	return newArr;
}
