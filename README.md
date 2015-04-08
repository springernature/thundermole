
ThunderMole
===========

Proxy requests to different applications based on an API response.


Installing
----------

- Install [Node.js][node]
- Clone this repo locally and `cd` into it
- Copy the sample routes with `cp config/routes.sample.json config/routes.json`
- Optionally copy the sample StatsD config with `cp config/statsd.sample.json config/statsd.json`
- Run `make` to install dependencies and run the test suite


Running ThunderMole
-------------------

```
npm start
```


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
