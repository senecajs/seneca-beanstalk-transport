# Getting started

You will run a Seneca service and a client that talk through beanstalkd.

## 1. Install

```sh
npm install seneca seneca-transport seneca-beanstalk-transport
```

Start beanstalkd. In a clone of this repository, `npm run services:up`
starts one on `127.0.0.1:11400`. Elsewhere, any beanstalkd works (its usual
port is 11300).

## 2. The program

This is [examples/getting-started.js](../examples/getting-started.js):

```js
const Seneca = require('seneca')

// In your own project: require('seneca-beanstalk-transport')
const BeanstalkTransport = require('../..')

const HOST = process.env.SENECA_TEST_BEANSTALK_HOST || '127.0.0.1'
const PORT = parseInt(process.env.SENECA_TEST_BEANSTALK_PORT || '11400', 10)

const service = Seneca({ log: 'silent' })
  .use('seneca-transport')
  .use(BeanstalkTransport)
  .add('role:math,cmd:sum', function (msg, reply) {
    reply({ answer: msg.left + msg.right })
  })
  .listen({ type: 'beanstalk', host: HOST, port: PORT, pin: 'role:math,cmd:*' })

service.ready(function () {
  const client = Seneca({ log: 'silent' })
    .use('seneca-transport')
    .use(BeanstalkTransport)
    .client({ type: 'beanstalk', host: HOST, port: PORT, pin: 'role:math,cmd:*' })

  client.ready(function () {
    client.act('role:math,cmd:sum,left:1,right:2', function (err, out) {
      if (err) throw err
      console.log('sum:', out.answer)
      client.close(function () {
        service.close(function () {
          console.log('closed')
        })
      })
    })
  })
})
```

Run it with `node docs/examples/getting-started.js`. Output with
`seneca@4.0.0-rc5`:

```
sum: 3
closed
```

## 3. What happens

1. `seneca-transport` provides the transport utilities. Seneca 4 does not
   include them in core, so it must be loaded before this plugin.
2. `listen` with `type: 'beanstalk'` opens two beanstalkd connections. One
   watches the request tube `seneca_cmd_sum_role_math__act`, the other uses
   the response tube `seneca_cmd_sum_role_math__res`.
3. `client` opens the mirror pair. `act` puts the message as a job on the
   request tube; the service reserves it, runs the action and puts the reply
   on the response tube, where the client reserves it.
4. `close` ends all beanstalkd connections so the process exits.

Pass `host` and `port` to `listen` and `client`: otherwise Seneca fills in
its default port 10101. See [Options](../reference/options.md).

## Next steps

* [Configure the connection](../how-to/configure-the-connection.md)
* [How it works](../explanation/how-it-works.md)
