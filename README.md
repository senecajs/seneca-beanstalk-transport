![Seneca](http://senecajs.org/files/assets/seneca-logo.png)
> A [Seneca.js][] message transport over beanstalkd queues.

# seneca-beanstalk-transport
[![Build Status][travis-badge]][travis-url]
[![Gitter][gitter-badge]][gitter-url]

[![js-standard-style][standard-badge]][standard-style]

A transport module that uses [beanstalkd][] as it's engine. It may also be used as an example on how to
implement a transport plugin for Seneca.

- __Version:__ 0.2.1
- __Tested on:__ Seneca 0.7.1
- __Node:__ 0.10, 0.11, 0.12, 4

If you're using this module, and need help, you can:

- Post a [github issue][],
- Tweet to [@senecajs][],
- Ask on the [Gitter][gitter-url].

If you are new to Seneca in general, please take a look at [senecajs.org][]. We have everything from
tutorials to sample apps to help get you up and running quickly.

## Install
To install, simply use npm. Remember you will need to install [Seneca.js][] if you haven't already.

```
npm install seneca
npm install seneca-beanstalk-transport
```

In order to use this transport, you need to have a [beanstalkd][] daemon running. The deamon
and instructions on how to install can be found on the beanstalkd [install page][].

## Test
To run tests, simply use npm:

```
npm run test
```

## Contributing
The [Senecajs org][] encourages open participation. If you feel you can help in any way, be it with
documentation, examples, extra testing, or new features please get in touch.

## License
Copyright Richard Rodger and other contributors 2014-2016, Licensed under [MIT][].

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
