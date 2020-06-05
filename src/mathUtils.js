export const sum = function(...values) {
	return values.reduce(function(accumulator, current) {
		return accumulator + current;
	});
};

export const avg = function(...values) {
	return sum(...values) / values.length;
};
