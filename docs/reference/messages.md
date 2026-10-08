# Messages

The plugin adds transport hooks that Seneca's `listen` and `client` call
through `seneca-transport`. You do not call these patterns directly.

## role:transport,hook:listen,type:beanstalk

Called by `seneca.listen({ type: 'beanstalk', ... })`.

* Parameters: `host`, `port`, `pin`/`pins`, and the job options in
  [Options](options.md).
* For each topic (one per pin, or `any`) it opens two connections: one
  watches `<topic>_act` and reserves request jobs, one uses `<topic>_res`
  for replies. Each request is handled with Seneca, the reply is put on
  `<topic>_res`, then the request job is deleted.
* Reply: replies immediately, before the connections are established.

## role:transport,hook:client,type:beanstalk

Called by `seneca.client({ type: 'beanstalk', ... })`.

* Parameters: as for listen.
* For each topic it opens a connection that uses `<topic>_act` to put
  requests and one that watches `<topic>_res`. A reply that belongs to this
  client is deleted; one that does not is released back to the tube.
* Reply: the send function, once the request connection has selected its
  tube.

## Legacy type queue

`role:transport,hook:listen,type:queue` and
`role:transport,hook:client,type:queue` are aliases of the two hooks above.

## Tube names

Topics come from seneca-transport `listen_topics` / `make_client`: the
prefix `seneca_` plus `any` when there is no pin, or the sorted pin keys and
values with non word characters replaced by `_`.

| Pin | Request tube | Response tube |
| --- | ------------ | ------------- |
| none | `seneca_any_act` | `seneca_any_res` |
| `role:math,cmd:*` | `seneca_cmd_sum_role_math__act` (one per matching action, here `cmd:sum`) | `seneca_cmd_sum_role_math__res` |

## Close hook

Each connection adds an override of the close pattern
(`sys:seneca,cmd:close` on Seneca 4, `role:seneca,cmd:close` on Seneca 3)
that marks the connection closed, ends it, and calls `prior`.

## Plugin name and exports

The plugin returns `{ name: 'beanstalk-transport' }` and exports nothing.
