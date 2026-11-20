# Changes

## 0.3.0 2026-11-20

First release under the name `@seneca/beanstalk-transport`. Versions up
to 0.2.1 were published as `seneca-beanstalk-transport`.

* Seneca 4: the peer dependency is `seneca` `^4.0.0`, and Seneca 3 is no
  longer supported. Seneca 3 users stay on `seneca-beanstalk-transport@0.2`.
  Tested against seneca 4.0.0 with `@seneca/transport` 9.0.0 and
  beanstalkd 1.13, on Node.js 26.
* Renamed from `seneca-beanstalk-transport` to
  `@seneca/beanstalk-transport`.
* Node.js 24 or later (`engines.node` `>=24`).
* Load `@seneca/transport` before this plugin; it is a peer dependency.
  Seneca 4 has no network transport built in, and the plugin fails with
  a clear error when the transport utilities are missing.
* Clients pass the message meta data that Seneca 4 gives the transport
  (`send(msg, reply, meta)`) to `prepare_request` (B9). Without it,
  messages had no id on Seneca 4, so concurrent requests could receive
  each other's replies or time out.
* The close hook is registered on `sys:seneca,cmd:close`, so beanstalkd
  connections are closed by `seneca.close()`.
* `seneca.util.deep` replaces `seneca.util.deepextend`, so Seneca 4 no
  longer warns with `SENECA_DEP_UTIL_DEEPEXTEND` (D2).
* Removed the `lodash` dependency, an exact pin of 4.15.0, a release with
  known prototype pollution advisories. `fivebeans` 1.5.0 still depends
  on `lodash` `~4.15.0`.
* Tests moved from lab 11 and `seneca-transport-test` to `node:test`,
  with beanstalkd started by `docker-compose.yml` (`npm run services:up`).
  New tests for concurrent requests and for a remote action error. No
  `.npmrc` is committed.
* Removed Travis, coveralls, docco, lint and pre-commit tooling.
* Documentation reorganized into tutorials, how-to guides, reference and
  explanation under `docs/`, and updated for this release.
