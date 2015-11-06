/* 

Write a program that exports a function that spawns a process from a `cmd`
string and an `args` array and returns a single duplex stream joining together
the stdin and stdout of the spawned process:

    var spawn = require('child_process').spawn;

    module.exports = function (cmd, args) {
        // spawn the process and return a single stream
        // joining together the stdin and stdout here
    };

There is a very handy module you can use here: duplexer2. The duplexer2 module
exports a single function `duplexer2(writable, readable)` that joins together a
writable stream and readable stream into a single, readable/writable duplex
stream.

If you use duplexer2, make sure to `npm install duplexer2` in the directory where
your solution file is located.

*/

// with duplexer2

var duplex = require('duplexer');

var spawn = require('child_process').spawn;

module.exports = function (cmd, args) {
	// spawn the child process
	var child = spawn(cmd, args); 
	// join stdin and stdout to make a duplex stream
	return duplex(child.stdin, child.stdout);
};

// without duplexer2

var spawn = require('child_process').spawn;
var Stream = require('stream');

module.exports = function (cmd, args) {

	var child = spawn(cmd, args), 
	    stream = new Stream();

	// writable stream
	stream.write = function (chunk, enc, cb) {
		child.stdin.write(chunk, enc, cb);
	};
	
	stream.end = function (chunk, enc, cb) {
		child.stdin.write(chunk, enc, cb);
	};

	// readable steam
	child.stdout.on('data', function (chunk) {
		stream.emit('data', chunk);
	});
	
	child.stdout.on('end', function(chunk) {
		stream.emit('end');
	});
	
	return stream;
};


