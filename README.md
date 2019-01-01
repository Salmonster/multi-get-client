# multi-get-client

---

## Description

By following the installation and usage instructions below, this client will fetch 4 MiB of binary data in 1 MiB increments from a user-provided URL which accepts http range requests.

Diff comparisons of file content produced by this program with output from the Sample Client that was provided with the assignment show no differences. This demonstrates consistency between the two clients in the order, size, and content of data retrieved from the same source.

## Installation

You should have [Node.js](https://nodejs.org) installed wherever you run the JavaScript source code for this client. This code was developed using Node v10.0.0 and was confirmed to work with v6.1.0. Running `npm install` is not necessary as there are no dependencies outside of built-in Node modules for the client to work.

```
Usage:  
  node multiGet.js URL [FILE]  
    Optionally write output to <FILE> instead of default
```

Additionally, I've packaged this client into several platform-specific executable files using the [pkg](https://www.npmjs.com/package/pkg) library. After unzipping `multi-get-executables.zip`, you can choose the executable appropriate to your platform and execute it without arguments to get relevant usage instructions. For example, running `./multiGet-linux` on a Linux/x64 machine will reveal the following instructions:

```
Usage:  
  ./multiGet-linux URL [FILE]  
    Optionally write output to <FILE> instead of default
```

