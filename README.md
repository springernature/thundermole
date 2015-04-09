
ThunderMole
===========

Proxy requests to different applications based on an API response.


Installing
----------

- Install [Node.js][node]
- Clone this repo locally and `cd` into it
- Copy the sample routes with `cp config/routes.sample.json config/routes.json`
- Optionally copy the sample StatsD config with `cp config/statsd.sample.json config/statsd.json`
- Optionally copy the sample syslog config with `cp config/syslog.sample.json config/syslog.json`
- Run `make` to install dependencies and run the test suite


Running ThunderMole
-------------------

```
Usage: bin/thundermole [options]

Options:

  -h, --help           output usage information
  -V, --version        output the version number
  -c, --config <path>  the directory to look for config files in
  -C, --cluster        create a cluster of workers for handling requests
  -p, --port <port>    the port to run on
  -w, --workers <num>  the number of workers to add to the cluster
```


JavaScript API
--------------

Thundermole can be loaded as a module and run programatically.


### Basic API

```js
var thundermole = require('thundermole');

// Create a thundermole application
var mole = thundermole({
    // ... options ...
});

// Start the thundermole application on port 3000
mole.listen(3000);
```


### Options

#### `routes` (object)

Required. A simple routing hash. Each property maps to the first part of a request path, and the value should indicate the API endpoint to use for matching requests.

#### `routes.default` (string)

Required. The default route to use if no others match the request.

#### `statsd` (object)

Optional. A [node-statsd][node-statsd] configuration object, as outlined in their documentation.

#### `logger` (object)

Optional. An object with the methods `debug`, `error`, `info`, and `warn` which will be used to report errors and request information.



Running Example Applications
----------------------------

ThunderMole comes with an example application which runs two APIs and two backends. To run these you'll need to install [Foreman][foreman], or look into the example [Procfile](example/Procfile) and spin up each process separately.

If you have Foreman, run the example application with:

```
foreman start -d example
```


Building ThunderMole-Compatible APIs
------------------------------------

In order for ThunderMole to be able to communicate with your API, you'll need to follow the [API Specification](/docs/API-Specification.md).


Testing
-------

Lint the JavaScript and run the test suite:

```
make
```


License
-------

Copyright &copy; Nature Publishing Group



[foreman]: https://github.com/ddollar/foreman
[node]: https://nodejs.org/
[node-statsd]: https://github.com/sivy/node-statsd
