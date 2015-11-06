/*

In this example, you will be given a readable stream, `counter`, as the first
argument to your exported function:

    module.exports = function (counter) {
        // return a duplex stream to count countries on the writable side
        // and pass through `counter` on the readable side
    };

Return a duplex stream with the `counter` as the readable side. You will be
written objects with a 2-character `country` field as input, such as these:

    {"short":"OH","name":"Ohio","country":"US"}
    {"name":"West Lothian","country":"GB","region":"Scotland"}
    {"short":"NSW","name":"New South Wales","country":"AU"}

Create an object to track the number of occurrences of each unique country code.

For example:

    {"US": 2, "GB": 3, "CN": 1}

Once the input ends, call `counter.setCounts()` with your counts object.

The `duplexer2` module will again be very handy in this example.

If you use duplexer, make sure to `npm install duplexer2` in the directory where
your solution file is located.

*/

// 'use strict'

// var duplex = require('duplexer')
// var through = require('through')

// module.exports = function (counter) {
//   var counts = {}
//   return duplex(through(record_count, set_count), counter)
//   function record_count(obj) {
//     var country = obj.country
//     var count = counts[country] || 0
//     counts[country] = count + 1
//   }

//   function set_count() {
//     counter.setCounts(counts);
//   }
// }

'use strict';

var duplexer = require('duplexer');
var through = require('through');


module.exports = function(counter) {
	var tallies = {};
	var writableStream;

	function recordCount(obj) {
		var country = obj.country;
		var count = tallies[country] || 0;
		tallies[country] = count + 1;
	}

	function setCounts() {
		counter.setCounts(tallies);
	}
	writableStream = through(recordCount, setCounts);
	return duplexer(writableStream, counter);
};



