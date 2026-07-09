![Seneca](http://senecajs.org/files/assets/seneca-logo.png)
> A [Seneca.js][] plugin

# @seneca/beanstalk-transport

| ![Voxgig](https://www.voxgig.com/res/img/vgt01r.png) | This open source module is sponsored and supported by [Voxgig](https://www.voxgig.com). |
|---|---|

## Install

To install, simply use npm. Remember you will need to install [Seneca.js][] if you haven't already.

```
npm install seneca
npm install seneca-beanstalk-transport
```

In order to use this transport, you need to have a [beanstalkd][] daemon running. The deamon
and instructions on how to install can be found on the beanstalkd [install page][].

## Quick Example

```js
require('seneca')()
  .use('seneca-beanstalk-transport')
  .listen({ type: 'beanstalk', pin: 'role:create' })
```

## More Examples

See [test/](test/) for usage examples.

## Motivation

Provides Beanstalk transport for Seneca microservice messages.

## Support

If you're using this module and need help, you can:

- Post a [github issue][]
- Tweet to [@senecajs][]

## API

See [seneca-transport](https://github.com/senecajs/seneca-transport) for configuration.

## Contributing

The [Senecajs org][] encourages open participation. If you feel you can help in any way, be it with documentation, examples, extra testing, or new features please get in touch.

### Running tests

```sh
npm run test
```

## Background

Uses the [fivebeans](https://github.com/ceejbot/fivebeans) client.

[![Build Status][travis-badge]][travis-url]
[![Gitter][gitter-badge]][gitter-url]
[![js-standard-style][standard-badge]][standard-style]
[travis-badge]: https://travis-ci.org/senecajs/seneca-beanstalk-transport.svg
[travis-url]: https://travis-ci.org/senecajs/seneca-beanstalk-transport
[gitter-badge]: https://badges.gitter.im/Join%20Chat.svg
[gitter-url]: https://gitter.im/senecajs/seneca
[standard-badge]: https://raw.githubusercontent.com/feross/standard/master/badge.png
[standard-style]: https://github.com/feross/standard
[beanstalkd]: http://kr.github.io/beanstalkd/
[install page]: http://kr.github.io/beanstalkd/download.html
[MIT]: ./LICENSE
[Senecajs org]: https://github.com/senecajs/
[Seneca.js]: https://www.npmjs.com/package/seneca
[senecajs.org]: http://senecajs.org/
[leveldb]: http://leveldb.org/
[github issue]: https://github.com/senecajs/seneca-beanstalk-transport/issues
[@senecajs]: http://twitter.com/senecajs
