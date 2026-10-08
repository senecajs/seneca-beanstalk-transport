# How it works

## Two connections per direction

beanstalkd connections either `use` one tube (to put jobs) or `watch` tubes
(to reserve jobs), and a blocking `reserve` occupies the connection. So the
plugin opens two fivebeans connections per topic on each side: one for
outgoing jobs and one for incoming jobs.

```
client                 beanstalkd                 listener
put  ---------------->  <topic>_act  ----------->  reserve, run action
reserve <------------  <topic>_res  <-----------  put reply, delete request
```

## Job lifecycle

1. The client puts the request on `<topic>_act` with `priority`, `delay`
   and `alivetime` (TTR).
2. The listener reserves it, runs the action and puts the reply on
   `<topic>_res`, then deletes the request.
3. The client reserves replies. seneca-transport matches the reply to a
   pending call; a reply for another client is released back to the tube.

Because requests are jobs, they wait in the tube until a listener reserves
them; the caller still sees Seneca's action timeout if no reply arrives.

## Interaction with Seneca core

The plugin only adds the `role:transport,hook:*` actions. Topic naming,
message encoding and reply matching come from `seneca-transport`'s
`transport/utils` export. Seneca 3 bundles seneca-transport; Seneca 4 does
not, so it must be loaded explicitly.

## Seneca 3 versus 4

| Topic | Seneca 3 | Seneca 4 |
| ----- | -------- | -------- |
| seneca-transport | built in | `use('seneca-transport')` needed |
| close pattern | `role:seneca,cmd:close` | `sys:seneca,cmd:close` |
| top level plugin options | merged | not merged |

## Limits

* Any beanstalkd error on an open connection is fatal (`seneca.die`); there
  is no reconnect.
* The `port` plugin option is always overridden by Seneca's default
  transport port unless the call gives a port.
