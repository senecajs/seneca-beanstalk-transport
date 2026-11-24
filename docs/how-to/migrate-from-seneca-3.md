# Migrate from Seneca 3

Goal: run an existing beanstalk service on Seneca 4.

1. Install `@seneca/beanstalk-transport` 0.3.0 or later, the Seneca 4
   version of `seneca-beanstalk-transport`, and remove the old package.
   Versions up to 0.2.1 register their close hook on
   `role:seneca,cmd:close`, and their clients do not pass the message
   meta data that Seneca 4 needs to match concurrent replies. Seneca 3
   users stay on `seneca-beanstalk-transport@0.2`.

   ```sh
   npm install seneca@^4 @seneca/transport @seneca/beanstalk-transport
   ```
2. Load `@seneca/transport` (the Seneca 4 version of seneca-transport)
   before this plugin. Seneca 3 had it built in; Seneca 4 does not.

   ```js
   Seneca().use('@seneca/transport').use('@seneca/beanstalk-transport')
   ```

   Without it, Seneca stops with a fatal `plugin_define_failed` error
   containing `beanstalk-transport: transport/utils not found`.
3. Pass plugin options to `use()`. Seneca 4 does not merge top level
   `options.<pluginname>` blocks into plugin options.
4. Remove `legacy.*` sub options other than `error`, `meta` and
   `builtin_actions`; Seneca 4 rejects them.

Tube names and the job format are unchanged, so Seneca 3 and Seneca 4
instances can share a beanstalkd.
