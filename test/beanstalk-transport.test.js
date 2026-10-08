/* Copyright (c) 2014-2026 Richard Rodger and other contributors, MIT License */
'use strict'

// The scenarios below were provided by seneca-transport-test@0.1.3, which
// depends on Seneca 3 only APIs (seneca.good). They are inlined here with the
// same test names and assertions.

const { describe, it } = require('node:test')
const assert = require('node:assert')

const Seneca = require('seneca')

// Defaults match docker-compose.yml.
const HOST = process.env.SENECA_TEST_BEANSTALK_HOST || '127.0.0.1'
const PORT = parseInt(process.env.SENECA_TEST_BEANSTALK_PORT || '11400', 10)

// As with every Seneca transport, listen() and client() fill in the core
// default host and port (10101) when none is given, so pass them explicitly.

const fafmap = {}

function foo_plugin () {
  this.add('foo:1', function (msg, reply) { reply(null, { dee: '1-' + msg.bar }) })
  this.add('nores:1', function (msg, reply) { reply() })
  this.add('faf:1', function (msg, reply) { fafmap[msg.k] = msg.v; reply() })
  this.add('role:a,cmd:1', function (msg, reply) { reply({ out: 'a1-' + msg.bar }) })
  this.add('role:b,cmd:2', function (msg, reply) { reply({ out: 'b2-' + msg.bar }) })
}

function make_seneca () {
  return Seneca({ log: 'silent' })
    .test()
    .quiet()
    .use('seneca-transport')
    .use(require('..'))
}

function foo_service (seneca) {
  return seneca
    .use(foo_plugin)
    .listen({ type: 'beanstalk', host: HOST, port: PORT, pin: { role: 'a', cmd: '*' } })
    .listen({ type: 'beanstalk', host: HOST, port: PORT })
    .listen({ type: 'beanstalk', host: HOST, port: PORT, pin: { role: 'b', cmd: '*' } })
}

function close_all (client, service, fin) {
  client.close(function (err) {
    if (err) return fin(err)
    service.close(fin)
  })
}

describe('beanstalk-transport', function () {
  it('happy-any', function (t, fin) {
    const service = foo_service(make_seneca())
    service.ready(function () {
      const client = make_seneca().client({ type: 'beanstalk', host: HOST, port: PORT })
      client.ready(function () {
        const done = (err) => err ? fin(err) : close_all(client, service, fin)
        client.act('foo:1,bar:A', function (err, out) {
          if (err) return done(err)
          assert.equal('{"dee":"1-A"}', JSON.stringify(out))
          client.act('foo:1,bar:AA', function (err, out) {
            if (err) return done(err)
            assert.equal('{"dee":"1-AA"}', JSON.stringify(out))
            client.act('nores:1', function (err, out) {
              if (err) return done(err)
              assert.equal(null, out)

              // fire-and-forget
              const k = '' + Math.random()
              const v = '' + Math.random()
              client.act('faf:1', { k: k, v: v })
              setTimeout(function () {
                try {
                  assert.equal(v, fafmap[k])
                } catch (e) { return done(e) }
                done()
              }, 222)
            })
          })
        })
      })
    })
  })

  it('happy-pin', function (t, fin) {
    const service = foo_service(make_seneca())
    service.ready(function () {
      const client = make_seneca()
        .client({ type: 'beanstalk', host: HOST, port: PORT, pin: { role: 'a', cmd: '*' } })
        .client({ type: 'beanstalk', host: HOST, port: PORT, pin: { role: 'b', cmd: '*' } })
      client.ready(function () {
        const done = (err) => err ? fin(err) : close_all(client, service, fin)
        client.act('role:a,cmd:1,bar:B', function (err, out) {
          if (err) return done(err)
          assert.equal('{"out":"a1-B"}', JSON.stringify(out))
          client.act('role:b,cmd:2,bar:BB', function (err, out) {
            if (err) return done(err)
            assert.equal('{"out":"b2-BB"}', JSON.stringify(out))
            done()
          })
        })
      })
    })
  })
})
