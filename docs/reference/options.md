# Options

Plugin options live under the `beanstalk` key:

```js
seneca.use('seneca-beanstalk-transport', { beanstalk: { priority: 100 } })
```

For each `listen` or `client` call the plugin builds its settings as
`options.beanstalk` overlaid with the arguments of that call
(`lib/index.js`, `hook_listen_beanstalk` and `hook_client_beanstalk`).
Seneca adds its own transport defaults to those arguments (`host`
`127.0.0.1` on Seneca 4, `port` 10101), so in practice `host` and `port` must
be given on the call.

| Option | Type | Default | Effect |
| ------ | ---- | ------- | ------ |
| `beanstalk.host` | string | `'localhost'` | beanstalkd host. Overridden by the call's `host`. |
| `beanstalk.port` | number | `11300` | beanstalkd port. Overridden by the call's `port`, which Seneca always sets. |
| `beanstalk.priority` | number | `100` | job priority for `put` and `release` (lower is more urgent). |
| `beanstalk.delay` | number | `0` | seconds before a put or released job becomes ready. |
| `beanstalk.alivetime` | number | `111` | time to run (TTR) in seconds for each job. |
| `beanstalk.timeout` | number | Seneca `timeout` minus 555, else `22222` | not used by the plugin. |
| `beanstalk.type` | string | `'beanstalk'` | not used by the plugin. |

## beanstalk.host

Passed to `new fivebeans.client(host, port)`.

## beanstalk.port

Passed to `new fivebeans.client(host, port)`. The local test setup uses 11400.

## beanstalk.priority

Priority argument of fivebeans `put` (requests and replies) and `release`
(client side, for replies it could not match).

## beanstalk.delay

Delay argument of `put` and `release`.

## beanstalk.alivetime

TTR argument of `put`. If a reserved job is not deleted within this time,
beanstalkd makes it ready again.

## beanstalk.timeout and beanstalk.type

Defined in the defaults but never read. Seneca's own action `timeout`
still applies to remote calls.

## Call arguments

Besides the options above, `listen` and `client` accept the usual
seneca-transport arguments, in particular `pin` (or `pins`), which selects
the tube names. See [Messages](messages.md#tube-names).
