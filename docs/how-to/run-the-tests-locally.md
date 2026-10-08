# Run the tests locally

Goal: run `npm test` against a real beanstalkd.

1. Use Node 24 (or 22) and install:

   ```sh
   npm install
   ```

   `.npmrc` sets `legacy-peer-deps=true` because `seneca-transport` declares
   `peer seneca >=3`, which excludes the Seneca 4 prerelease.

2. Start beanstalkd:

   ```sh
   npm run services:up     # docker compose up -d --wait
   ```

   `docker-compose.yml` (project `seneca-beanstalk-transport`) runs
   `alpine:3.24`, installs the Alpine `beanstalkd` package (1.13) and maps
   host port 11400 to container port 11300. The container is
   `seneca-beanstalk-transport-beanstalkd`.

3. Run the tests:

   ```sh
   npm test
   ```

   | Variable | Default | Meaning |
   | -------- | ------- | ------- |
   | `SENECA_TEST_BEANSTALK_HOST` | `127.0.0.1` | beanstalkd host |
   | `SENECA_TEST_BEANSTALK_PORT` | `11400` | beanstalkd port |

4. Optionally test against another Seneca build, for example
   `npm install --no-save <path>/seneca-4.0.0.tgz && npm test`, then
   `npm install` to restore the devDependency.

5. Stop beanstalkd:

   ```sh
   npm run services:down   # docker compose down -v
   ```

CI runs the same container from a workflow step; see
[.patches](../../.patches/README.md).
