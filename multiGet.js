const fs = require('fs');
const urlLib = require('url');
const http = require('http');

// Variables used across helper functions.
let urlPath;
let filename;
const resourceUrl = process.argv[2];


function validateUsage() {
    const usageMessage =
        `Usage:\n\tnode multiGet.js URL [FILE]\n\t\u00A0` +
        `Optionally write output to <FILE> instead of default`;

    // If there's no url, or too many arguments, inform user of proper usage.
    if (!resourceUrl || process.argv.length > 4) {
        console.log(usageMessage);
        // Similar misuse of other CLI tools exit with success, so we'll follow suit.
        process.exit(0);
    }
    // If the url isn't an http address, quit early. If it's still an
    // invalid url then we'll return the error message from querying it later.
    else if (!resourceUrl.startsWith('http://')) {
        // Print errors to stderr.
        console.error(`[ERROR] Invalid url: ${process.argv[2]}`);
        process.exit(1);
    }
}

function setFilePath() {
    // Grab the url path to use as the filename to save to, if not provided.
    // Otherwise default to index.html.
    urlPath = urlLib.parse(resourceUrl, true).pathname;
    filename = process.argv[3] ? process.argv[3]
               : urlPath.length > 1 ? urlPath.substring(1)
               : 'index.html';

    // Make this file check blocking so we don't do anything
    // else before verifying we have a new place to store data.
    if (fs.existsSync(filename)) {
        console.error(`[ERROR] File '${filename}' already exists`);
        process.exit(1);
    }
}

function getUrlAndStoreData() {
    // Set up default parameters for range requests, per requirements.
    //   1 MiB = 1048576 bytes, we need 4 chunks this size.
    let chunkCount = 4;
    let chunkSize = 1048576;
    let chunks = [];
    let chunkMeter = 0;
    let httpOptions = {
        headers: { 'Range': '' },
        host: urlLib.parse(resourceUrl, true).host,
        path: urlPath
    };

    console.log(`Downloading first 4 chunks of '${resourceUrl}' to '${filename}'`);

    for (let index = 0; index < chunkCount; index++) {
        // Adjust the byte range for each call.
        httpOptions.headers.Range = `bytes=${index * chunkSize}-${(index+1) * chunkSize - 1}`;

        http.get(httpOptions, (res) => {
            const { statusCode, statusMessage } = res;
            let error;
            let dataBuffers = [];
            // Check for partial content success status.
            if (statusCode !== 206) {
                error = new Error(`[ERROR] Unexpected response from server: ${statusCode} ${statusMessage}`);
            }
            if (error) {
                console.error(error.message);
                // Consume response data to free up memory.
                res.resume();
                process.exit(1);
            }

            res.on('data', (buffer) => {
                // Binary data is received as a stream of smaller buffer objects.
                // Add them to our temporary array for this request.
                dataBuffers.push(buffer);
            });

            res.on('end', () => {
                // Cf. https://nodejs.org/docs/latest-v10.x/api/buffer.html
                // Insert the buffer array into its correct slot in the array of 1 MiB chunks.
                chunks[index] = Buffer.concat(dataBuffers);
                // Confirm each of our chunks is equal to chunkSize of 1048576 bytes.
                // console.log(chunks[index].length);

                // Mark the end of a successful download...
                console.log('.');
                chunkMeter++;
                if (chunkMeter === 4) {
                    try {
                        const chunksBuffer = Buffer.concat(chunks);
                        // Using an 'fs' stream object wasn't working as expected and there's a lack of
                        // documentation or examples on how to use the 'start' offset mentioned in
                        // https://nodejs.org/api/fs.html#fs_fs_createwritestream_path_options.
                        // Instead, we wait until all requests have 'end'-ed as indicated by our
                        // chunkMeter and write the consolidated buffer to file all at once, pre-sorted.
                        //
                        // Cf. https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback
                        fs.writeFile(filename, chunksBuffer, function(error) {
                            if (error) {
                                console.error(`[ERROR] Could not write file '${filename}'`);
                                process.exit(1);
                            }
                            // If we've gotten this far, the data is written to disk.
                            console.log('done');
                        });
                    }
                    catch(error) {
                        console.error(`[ERROR] Could not write file '${filename}'`);
                        process.exit(1);
                    }
                }
            });
          }).on('error', (error) => {
            console.error(`[ERROR] Unexpected response from server: ${error.message}`);
            process.exit(1);
          });
    }
}

function main() {
    validateUsage();
    setFilePath();
    getUrlAndStoreData();
}

main();
