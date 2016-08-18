
# History

## 1.6.1 (2016-08-18)

  * Update API Specification to document the new `set_headers` behaviour

## 1.6.0 (2016-08-17)

  * Allow extra headers returned from the API to be used in redirects

## 1.5.0 (2016-06-17)

  * Return a Bad Gateway instead of Internal Server Error for proxy connection errors
  * Graph proxy responses by status code
  * Log the status code returned for an API error

## 1.4.0 (2016-02-22)

  * Allow an API to send extra headers to a proxy target

## 1.3.1 (2016-02-10)

  * Update repository references to springernature
  * Update the license

## 1.3.0 (2015-10-26)

  * Send a User-Agent header to the API
  * Send the original User-Agent header to the API for use in routing

## 1.2.1 (2015-10-14)

  * Support Node.js 4.x
  * Add code-coverage reporting
  * Update dependencies

## 1.2.0 (2015-09-30)

  * Send the original host header through to the API for use in routing

## 1.1.0 (2015-07-29)

  * Send the original request method through to the API for use in routing

## 1.0.0 (2015-07-13)

  * Stable public release

## 0.6.0 pre-release (2015-07-09)

  * License under GPL-3.0
  * Update the documentation
  * Check code-style with JSCS

## 0.5.0 pre-release (2015-07-01)

  * Support regular expressions in API routing

## 0.4.0 pre-release (2015-06-22)

  * Add support for 307 redirects

## 0.3.3 pre-release (2015-06-17)

  * Decide on a consistent naming case
  * Update dependencies

## 0.3.2 pre-release (2015-05-18)

  * Send a correct content-type for error pages

## 0.3.1 pre-release (2015-05-15)

  * Log redirects properly

## 0.3.0 pre-release (2015-05-15)

  * Build in redirecting

## 0.2.0 pre-release (2015-05-06)

  * Log full error stacks
  * Add the rewrite-host-header option to the CLI
  * Add the ability to specify a ping URL for monitoring

## 0.1.0 pre-release (2015-04-13)

  * Initial release
