
Thundermole API Specification
=============================

This specification outlines how to build an API that is compatible with Thundermole.


Endpoints
---------

APIs should have a single `GET` endpoint. Thundermole will make a request like this:

```
GET /path/to?resource={resource_path} HTTP/1.1
Host: example.com
Accept: application/json
Connection: keep-alive
Cookie: {cookie}
```

In this request:

`{resource_path}` will be set to the full path of the original request that came into Thundermole. This will include query parameters which can be parsed by the API.

`{cookie}` will be set to the `Cookie` header of the original request that came into Thundermole, unchanged.


Responses
---------

If the original request should be proxied, the API should respond with the following information:

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

If the original request should be redirected, the API should respond with the following:

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
    "redirect": "{redirect_url}",
    "redirect_type": {redirect_type}
}
```

In these responses:

`{target_url}` is the target application that Thundermole should proxy the original request to. This should only comprise of the scheme, host, and port parts of the URL with no path. E.g. `"http://example.com:1234"`

`{redirect_url}` is the target URL that Thundermole should redirect the original request to. This should be the full URL you wish to redirect to.

`{redirect_type}` is the redirect status code to use when Thundermole redirects. It is optional, and will default to `301`. This should be a number, not a string, and only `301`, `302`, `303`, and `307` values are accepted.

The `append` property should be an object that will be passed onto the target application in the `X-Proxy-Appended-Data` header, serialized as JSON. Append data is only used when proxying, not redirecting.

Any extra headers or body properties will be ignored.
