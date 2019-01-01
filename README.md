# multi-get-client

---

## Description

By following the installation and usage instructions below, this client will fetch 4 MiB of binary data in 1 MiB increments from a user-provided URL which accepts http range requests.

Diff comparisons of file content produced by this program with output from the Sample Client provided with the assignment show no differences and demonstrate consistency in the order, size, and content of the data retrieved.

## Installation

You should have [Node.js](https://nodejs.org) installed wherever you run this program. This code was developed using Node v10.0.0 and was confirmed to work with v6.1.0.

Running `npm install` is not necessary as there are no dependencies outside of built-in Node modules.

```
Usage:  
  node multiGet.js URL [FILE]  
    Optionally write output to <FILE> instead of default
```

