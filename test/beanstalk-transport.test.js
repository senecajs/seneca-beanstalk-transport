/* Copyright (c) 2014 Richard Rodger */
'use strict'

var Lab = require('lab')

var lab = exports.lab = Lab.script()
var describe = lab.describe
var it = lab.it

var test = require('seneca-transport-test')

describe('beanstalk-transport', function () {
  it('happy-any', function (fin) {
    test.foo_test('beanstalk-transport', require, fin, 'beanstalk', -11300)
  })

  it('happy-pin', function (fin) {
    test.foo_pintest('beanstalk-transport', require, fin, 'beanstalk', -11300)
  })
})
