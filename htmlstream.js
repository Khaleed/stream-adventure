/*

Your program will get some html written to stdin. Convert all the inner html to
upper-case for elements with a class name of "loud",
and pipe all the html to stdout.

You can use `trumpet` and `through2` to solve this adventure.

With `trumpet` you can create a transform stream from a css selector:

    var trumpet = require('trumpet');
    var fs = require('fs');
    var tr = trumpet();
    fs.createReadStream('input.html').pipe(tr);

    var stream = tr.select('.beep').createStream();

Now `stream` outputs all the inner html content at `'.beep'` and the data you
write to `stream` will appear as the new inner html content.

Make sure to `npm install trumpet through2` in the directory where your solution
file lives.

*/

'use strict';

var fs = require('fs');
var trumpet = require('trumpet');
var through2 = require('through2');

var tr = trumpet();

var write = function (buffer, _, next) {
	this.push(buffer.toString().toUpperCase());
	next();
};

var stream = tr.select('.loud').createStream();

stream.pipe(through2(write)).pipe(stream);

process.stdin.pipe(tr).pipe(process.stdout);







 