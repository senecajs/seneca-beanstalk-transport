# Changes

## 0.3.0

* Support the Seneca 4 prerelease (`4.0.0-rc5`) and 4.0.0, as well as
  Seneca 3. On Seneca 4 load `seneca-transport` before this plugin; the
  plugin now fails with a clear error when seneca-transport is missing.
* The close hook is registered on `sys:seneca,cmd:close` on Seneca 4 and on
  `role:seneca,cmd:close` on Seneca 3, so beanstalkd connections are closed
  by `seneca.close()` on both.
* Tested on Node 24 and 22.
* Tests moved from lab 11 and `seneca-transport-test` to `node:test`, with
  beanstalkd started by `docker-compose.yml` (`npm run services:up`).
* Removed Travis, coveralls, docco, lint and pre-commit tooling.
* Documentation reorganized into tutorials, how-to guides, reference and
  explanation under `docs/`.
