
ThunderMole API Specification
=============================

This specification outlines how to build an API that is compatible with ThunderMole.


Endpoints
---------

APIs should have a single `GET` endpoint. ThunderMole will make a request like this:

```
GET /path/to?resource={resource_path} HTTP/1.1
Host: example.com
Accept: application/json
Connection: keep-alive
Cookie: {cookie}
```

In this request:

`{resource_path}` will be set to the full path of the original request that came into ThunderMole. This will include query parameters which can be parsed by the API.

`{cookie}` will be set to the `Cookie` header of the original request that came into ThunderMole, unchanged.


Responses
---------

The API should respond with the following information. Any extra headers or body properties will be ignored:

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
    "target": "{target_url}",
    "append": {
        "{append_property}": "{append_value}"
    }
}
```

In this response:

`{target_url}` is the target application that ThunderMole should proxy the original request to. This should only comprise of the scheme, host, and port parts of the URL with no path. E.g. `"http://example.com:1234"`

The `append` property should be an object that will be passed onto the target application in the `X-Proxy-Appended-Data` header, serialized as JSON.
