# Migrate from Seneca 3

Goal: run an existing beanstalk service on Seneca 4.

1. Upgrade to `seneca-beanstalk-transport` 0.3.0 or later. Earlier versions
   register their close hook on `role:seneca,cmd:close`, which Seneca
   4.0.0-rc5 never calls, so connections stay open after `close()`.
2. Install and load `seneca-transport` before this plugin. Seneca 3 had it
   built in; Seneca 4 does not.

   ```js
   Seneca().use('seneca-transport').use('seneca-beanstalk-transport')
   ```

   Without it, Seneca stops with a fatal `plugin_define_failed` error
   containing `beanstalk-transport: transport/utils not found`.
3. Pass plugin options to `use()`. Seneca 4 does not merge top level
   `options.<pluginname>` blocks into plugin options.
4. Remove `legacy.*` sub options other than `error`, `meta` and
   `builtin_actions`; Seneca 4 rejects them.

Tube names and the job format are unchanged, so Seneca 3 and Seneca 4
instances can share a beanstalkd.
