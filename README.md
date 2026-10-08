![Seneca](http://senecajs.org/files/assets/seneca-logo.png)
> A [Seneca.js](https://www.npmjs.com/package/seneca) plugin

# @seneca/beanstalk-transport

A Seneca transport that carries messages between services through
[beanstalkd](https://beanstalkd.github.io/) work queues, using the
[fivebeans](https://github.com/ceejbot/fivebeans) client. It works with
Seneca 3 and Seneca 4 (tested with `4.0.0-rc5` and 4.0.0), on Node 24 and 22.
The package is published on npm as `seneca-beanstalk-transport`.

[![npm version](https://img.shields.io/npm/v/seneca-beanstalk-transport.svg)](https://npmjs.com/package/seneca-beanstalk-transport)

| ![Voxgig](https://www.voxgig.com/res/img/vgt01r.png) | This open source module is sponsored and supported by [Voxgig](https://www.voxgig.com). |
|---|---|

## Install

```sh
npm install seneca seneca-transport seneca-beanstalk-transport
```

You need a running beanstalkd. For local work `npm run services:up` in this
repository starts one in Docker on port 11400.

## Quick Example

```js
const Seneca = require('seneca')

Seneca()
  .use('seneca-transport') // required on Seneca 4
  .use('seneca-beanstalk-transport')
  .add('role:math,cmd:sum', (msg, reply) => reply({ answer: msg.left + msg.right }))
  .listen({ type: 'beanstalk', host: '127.0.0.1', port: 11300, pin: 'role:math,cmd:*' })
```

A client uses `.client({ type: 'beanstalk', ... })` with the same host, port
and pin. The full program is in the
[getting started tutorial](docs/tutorials/getting-started.md).

## More Examples

* [Getting started](docs/tutorials/getting-started.md): a service and a client over beanstalkd.
* [Configure the connection](docs/how-to/configure-the-connection.md)
* [Migrate from Seneca 3](docs/how-to/migrate-from-seneca-3.md)
* [Run the tests locally](docs/how-to/run-the-tests-locally.md)

## Motivation

beanstalkd is a small, fast work queue. Using it as a Seneca transport lets
services exchange messages through queues instead of direct HTTP calls:
a request waits in a beanstalkd tube until a listener reserves it. See
[How it works](docs/explanation/how-it-works.md).

## Support

* Post a [GitHub issue](https://github.com/senecajs/seneca-beanstalk-transport/issues).
* Read the [Seneca documentation](https://senecajs.org).
* The plugin is supported by [Voxgig](https://www.voxgig.com).

## API

| Item | Summary | Reference |
| ---- | ------- | --------- |
| Transport types | `beanstalk`, and the legacy alias `queue` | [messages.md](docs/reference/messages.md) |
| Options | `beanstalk.host`, `port`, `priority`, `delay`, `alivetime`, ... | [options.md](docs/reference/options.md) |
| Errors | no error codes; connection errors are fatal | [errors.md](docs/reference/errors.md) |

## Contributing

Tests need beanstalkd and Docker:

```sh
npm install
npm run services:up      # beanstalkd on 127.0.0.1:11400
npm test                 # node:test, Node 24 or 22
npm run services:down
```

The devDependency is the Seneca 4 prerelease (`seneca@^4.0.0-rc5`). See
[Run the tests locally](docs/how-to/run-the-tests-locally.md). The CI workflow
is delivered as a patch in [.patches](.patches/README.md).

## Background

This plugin was written in 2014 for Seneca 0.x and has been kept working with
later Seneca versions.

| Plugin | Seneca | Node |
| ------ | ------ | ---- |
| 0.3.x  | 3.x and 4.x (needs `seneca-transport` on 4) | 22, 24 |
| 0.2.x  | 1.x to 3.x | 4, 6 |

Changes are listed in [CHANGES.md](CHANGES.md). Licensed under
[MIT](LICENSE).
