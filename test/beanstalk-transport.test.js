/* Copyright (c) 2014 Richard Rodger */
"use strict";


// mocha beanstalk-transport.test.js

var test = require('seneca-transport-test')


describe('beanstalk-transport', function() {

  it('happy', function( fin ) {
    test.foo_test( require, fin, 'beanstalk' )
  })

})
