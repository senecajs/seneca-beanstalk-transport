# Configure the connection

Goal: connect the transport to your beanstalkd and set job parameters.

1. Give `host` and `port` on every `listen` and `client` call. These win over
   plugin options, and Seneca always supplies a default `port` (10101), so
   the plugin option `beanstalk.port` alone is not enough.

   ```js
   seneca.listen({ type: 'beanstalk', host: 'queue.internal', port: 11300 })
   seneca.client({ type: 'beanstalk', host: 'queue.internal', port: 11300 })
   ```

2. Set job parameters either per call or once as plugin options under the
   `beanstalk` key:

   ```js
   seneca.use('seneca-beanstalk-transport', {
     beanstalk: { priority: 10, delay: 0, alivetime: 60 }
   })
   ```

   Values given to `listen`/`client` override the plugin options.

3. Use the same pin on both sides. The pin selects the tube names, so a
   client and a listener only meet when their pins match. See
   [Messages](../reference/messages.md#tube-names).

All options are listed in [Options](../reference/options.md).
