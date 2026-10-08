# Errors

The plugin defines no error codes.

## Connection and protocol errors

Every fivebeans error (connection refused, `use`, `watch`, `reserve`, `put`,
`destroy`, `release` failures) goes to a handler made by
`make_error_handler` in `lib/index.js`:

* if the connection has been closed by `seneca.close()`, the error is logged
  with `seneca.log.error` and ignored;
* otherwise the plugin calls `seneca.die(err, 'beanstalk', { type, tag, note })`,
  which is fatal for the Seneca instance.

So an unreachable beanstalkd stops the process. Start beanstalkd before the
service.

## Missing seneca-transport

On Seneca 4, when `seneca-transport` was not loaded first, the plugin
definition throws and Seneca reports a fatal `plugin_define_failed` whose
message contains:

```
beanstalk-transport: transport/utils not found; call seneca.use('seneca-transport') before this plugin
```

Seneca 4 core exports its own smaller `transport/utils`; the plugin checks for
`listen_topics` and `make_client`, which only seneca-transport provides.

## Remote action errors

Errors replied by remote actions are carried back by seneca-transport and
reach the `act` callback as on any other transport.
