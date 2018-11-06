const sum = function(...values) {
	return values.reduce(function(accumulator, current) {
		return accumulator + current;
	});
};

const avg = function(...values) {
	return sum(...values) / values.length;
};

module.exports = {
	sum,
	avg,
};
