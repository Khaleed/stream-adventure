
var combiner = require('stream-combiner');
var split = require('split');

module.exports = function() {
	
	return combiner(
		// read newline-separated json,
		// group books into genres,
		// then gzip the output
		process.openStdin(), // open stdin 
		split();
		process.stdout; 
	);

};