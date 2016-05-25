/*

Your program should generate a newline-separated list of JSON lines of genres,
each with a `"books"` array containing all the books in that genre. The input
above would yield the output:

    {"name":"cyberpunk","books":["Neuromancer","Snow Crash"]}
    {"name":"space opera","books":["A Deepness in the Sky","Void"]}

Your stream should take this list of JSON lines and gzip it with
`zlib.createGzip()`.

* HINTS *

The `stream-combiner` module creates a pipeline from a list of streams,
returning a single stream that exposes the first stream as the writable side and
the last stream as the readable side like the `duplexer` module, but with an
arbitrary number of streams in between. Unlike the `duplexer` module, each
stream is piped to the next. For example:

    var combine = require('stream-combiner');
    var stream = combine(a, b, c, d);

will internally do `a.pipe(b).pipe(c).pipe(d)` but the `stream` returned by
`combine()` has its writable side hooked into `a` and its readable side hooked
into `d`.

As in the previous LINES adventure, the `split` module is very handy here. You
can put a split stream directly into the stream-combiner pipeline.
Note that split can send empty lines too.

If you end up using `split` and `stream-combiner`, make sure to install them
into the directory where your solution file resides by doing:

npm install stream-combiner split

*/

var combiner = require('stream-combiner');
var through = require('through');
var zlib = require('zlib');

module.exports = function () {
    var bufferToJson = through(function(buffer) {
        this.queue(JSON.parse(buffer.toString()));
    });

    var genre;
    var genreGrouper = through(function(line) {
        if (line.type === "genre") {
            if (genre !== undefined) {
                this.queue(genre);
            }

            genre = { name: line.name, books: [] };
        } else if (line.type === "book") {
            genre.books.push(line.name);
        }
    }, function() {
        this.queue(genre);
        this.queue(null);
    });

    var toStringer = through(function(genreObj) {
        this.queue(JSON.stringify(genreObj) + "\n");
    });

    return combiner(
        bufferToJson,
        genreGrouper,
        toStringer,
        zlib.createGzip()
    );
};
