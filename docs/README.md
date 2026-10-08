# seneca-beanstalk-transport documentation

## Tutorials

| Page | Learn to |
| ---- | -------- |
| [Getting started](tutorials/getting-started.md) | run a service and a client over beanstalkd |

## How-to guides

| Page | Goal |
| ---- | ---- |
| [Configure the connection](how-to/configure-the-connection.md) | point the transport at your beanstalkd and tune jobs |
| [Migrate from Seneca 3](how-to/migrate-from-seneca-3.md) | keep a beanstalk service working on Seneca 4 |
| [Run the tests locally](how-to/run-the-tests-locally.md) | start beanstalkd in Docker and run `npm test` |

## Reference

| Page | Contents |
| ---- | -------- |
| [Options](reference/options.md) | every plugin option and connection setting |
| [Messages](reference/messages.md) | the transport hook patterns and tube names |
| [Errors](reference/errors.md) | how failures are reported |

## Explanation

| Page | Topic |
| ---- | ----- |
| [How it works](explanation/how-it-works.md) | connections, tubes, job lifecycle, Seneca 3 versus 4 |

## Feature index

| Feature | Kind | Page |
| ------- | ---- | ---- |
| `beanstalk.host` | option | [options.md](reference/options.md#beanstalkhost) |
| `beanstalk.port` | option | [options.md](reference/options.md#beanstalkport) |
| `beanstalk.priority` | option | [options.md](reference/options.md#beanstalkpriority) |
| `beanstalk.delay` | option | [options.md](reference/options.md#beanstalkdelay) |
| `beanstalk.alivetime` | option | [options.md](reference/options.md#beanstalkalivetime) |
| `beanstalk.timeout` | option (unused) | [options.md](reference/options.md#beanstalktimeout-and-beanstalktype) |
| `beanstalk.type` | option (unused) | [options.md](reference/options.md#beanstalktimeout-and-beanstalktype) |
| `SENECA_TEST_BEANSTALK_HOST`, `SENECA_TEST_BEANSTALK_PORT` | test env | [run-the-tests-locally.md](how-to/run-the-tests-locally.md) |
| `role:transport,hook:listen,type:beanstalk` | action | [messages.md](reference/messages.md#roletransporthooklistentypebeanstalk) |
| `role:transport,hook:client,type:beanstalk` | action | [messages.md](reference/messages.md#roletransporthookclienttypebeanstalk) |
| `role:transport,hook:listen,type:queue` | action (legacy alias) | [messages.md](reference/messages.md#legacy-type-queue) |
| `role:transport,hook:client,type:queue` | action (legacy alias) | [messages.md](reference/messages.md#legacy-type-queue) |
| close hook `sys:seneca,cmd:close` / `role:seneca,cmd:close` | action override | [messages.md](reference/messages.md#close-hook) |
| plugin name `beanstalk-transport` | export | [messages.md](reference/messages.md#plugin-name-and-exports) |
| fatal connection errors (`seneca.die`) | error | [errors.md](reference/errors.md) |
| missing `transport/utils` | error | [errors.md](reference/errors.md#missing-seneca-transport) |
