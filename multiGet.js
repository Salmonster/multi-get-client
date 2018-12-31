const fs = require('fs');
const urlLib = require('url');
const http = require('http');


const usageMessage =
    `Usage:\n\tnode multiGet.js URL [FILE]
     \tOptionally write output to <FILE> instead of default`;

const resourceUrl = process.argv[2];
// If there's no url, or too many arguments, inform user of proper usage.
if (!resourceUrl || process.argv.length > 4) {
    console.log(usageMessage);
}
// If the url isn't an http address, quit early. If it's
// still an invalid url then we'll return the error
// message from querying it later on.
else if (!resourceUrl.startsWith('http://')) {
    console.log(`[ERROR] Invalid url: ${process.argv[2]}`);
}

// Pseudo code
//
// Check Usage
// console.log usage statement like the sample client if:
//  - No arg or more than two args provided to script
//  - Usage: 
//      node multiGet.js URL [FILE]
//      Optionally write output to <FILE> instead of default
//
// Begin File IO
//  - Check for optional arg for file path to save,
//      otherwise set default of CWD with filename of url lib's pathname.
//    If no pathname from url (check length) then default to index.html.
//  - Use fs.createWriteStream, cf. https://nodejs.org/api/fs.html#fs_fs_createwritestream_path_options
//                                  https://stackabuse.com/writing-to-files-in-node-js
//      Start it before the first http call, will autoclose when done.
//  - error checking, printing, process.exit(1)
//      - [ERROR] File '/testFile' exists
//
// HTTP GET in a loop
// * Don't check for Accept-Ranges header from HEAD request ("out of scope")
// * Resist using synchronous calls: lower performance and unneeded to maintain order of data.
// * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range
//   Don't use multi-range header option to return multipart doc. The
//   optional feature is to run multiple requests in parallel or serially.
// - https://nodejs.org/docs/latest-v10.x/api/http.html#http_http_get_url_options_callback
// - Be sure to use the 'data', 'error' and 'end' (finally) handlers.
// - Download Message: Downloading first 4 chunks of 'resourceUrl' to 'filename'
//                      ....done  (print dot with each request)
// - Create Buffer object to hold data before writing? (wait to see if needed upon data errors),
//      cf. http://codewinds.com/blog/2013-08-19-nodejs-writable-streams.html
//      Be wary in case you must do res.setEncoding('binary') before storing response data via
//          Buffer.from(responseData, 'binary').
// - error checking, printing, process.exit(1)
//      - [ERROR] Unexpected response from server: 403 Forbidden
//      - [ERROR] runtime error: invalid memory address or nil pointer dereference
//         (this one happened on a bad url)
// 
// Back to File Save
//  - Use the 'encoding' option passed in on fs stream instantiation to maintain binary type(?)
//    Pass in the 'start' option on each write to maintain data order.
//    Use the loop index from each http call to associate with byte 'start' point
//      If tests of 'head'ing and 'tail'ing the outputs show out of order results,
//      you may need to use Buffer object to build an ordered array that you then
//      write to file when all chunks are retrieved.
//  - error checking, printing, process.exit(1)
//    - Do a file.read() or .resume() in error handler, cf. https://stackoverflow.com/questions/20864036/error-handling-on-createwritestream
//    - [ERROR] Could not write file '/tempDir/testFile'


