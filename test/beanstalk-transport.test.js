/* Copyright (c) 2014 Richard Rodger */
"use strict";


// mocha beanstalk-transport.test.js

var test = require('seneca-transport-test')


describe('beanstalk-transport', function() {

  it('happy-any', function( fin ) {
    test.foo_test( 'beanstalk-transport', require, fin, 'beanstalk', -11300 )
  })

  it('happy-pin', function( fin ) {
    test.foo_pintest( 'beanstalk-transport', require, fin, 'beanstalk', -11300 )
  })

  it('happy-multiple-origin', function( fin ) {
    test.multiple_origin_test( 'beanstalk-transport', require, fin, 'beanstalk', -11300 )
  })

})
