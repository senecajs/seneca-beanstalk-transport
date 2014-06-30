/* Copyright (c) 2014 Richard Rodger, MIT License */
"use strict";


var buffer = require('buffer')
var util   = require('util')
var net    = require('net')
var stream = require('stream')


var _         = require('underscore')
var fivebeans = require('fivebeans')


module.exports = function( options ) {
  var seneca = this
  var plugin = 'beanstalk-transport'

  var so = seneca.options()

  options = seneca.util.deepextend(
    {
      beanstalk: {
        timeout:  so.timeout ? so.timeout-555 :  22222,
        type:     'beanstalk',
        alivetime: 111,
        port:      11300,
        host:      'localhost',
      },
    },
    so.transport,
    options)
  

  var tu = seneca.export('transport/utils')


  seneca.add({role:'transport',hook:'listen',type:'beanstalk'}, 
             hook_listen_beanstalk)

  seneca.add({role:'transport',hook:'client',type:'beanstalk'}, 
             hook_client_beanstalk)

  // Legacy patterns
  seneca.add({role:'transport',hook:'listen',type:'queue'}, hook_listen_beanstalk)
  seneca.add({role:'transport',hook:'client',type:'queue'}, hook_client_beanstalk)



  function hook_listen_beanstalk( args, done ) {
    var seneca         = this
    var type           = args.type
    var listen_options = seneca.util.clean(_.extend({},options[type],args))

    tu.listen_topics( seneca, args, listen_options, function(topic) {

      var beanstalk_out = make_fivebeans( listen_options )

      beanstalk_out
        .on('connect', function() {
          beanstalk_out.use( topic+'_res', function(err, numwatched) {
            if( err ) return fivebeans_use_error(seneca,'client',topic,
                                                 listen_options,err);
            seneca.log.info('listen', 'connect', 'out', topic, 
                            listen_options, seneca)
          })
        })

      connect_fivebeans( seneca, beanstalk_out, 'listen', 'out', 
                         topic, listen_options )

      var beanstalk_in = make_fivebeans( listen_options )

      beanstalk_in
        .on('connect', function() {
          var acttopic = topic+'_act'

          beanstalk_in.watch(acttopic, function(err, numwatched) {
            if( err ) {
              return seneca.log.error('listen', 'watch', 'in', acttopic, 
                                      listen_options, seneca, err.stack||err)
            }

            function do_reserve() {
              beanstalk_in.reserve(function(err, jobid, payload) {
                if( err ) {
                  return seneca.log.error('listen', 'reserve', 'in', acttopic, 
                                          jobid, payload, 
                                          listen_options, seneca, err.stack||err)
                }

                var data = tu.parseJSON( seneca, 'listen-'+type, payload )
                if( data ) {
                  tu.handle_request( seneca, data, listen_options, function(out){
                    if( null == out ) return process.nextTick(do_reserve);

                    var outstr = tu.stringifyJSON( seneca, 'listen-'+type, out )

                    beanstalk_out.put(
                      100,0,listen_options.alivetime,
                      outstr, function(err,outjobid) {
                        if( err ) {
                          return seneca.log.error(
                            'listen', 'put', 'in', acttopic, 
                            outjobid, payload, outstr, 
                            listen_options, seneca, err.stack||err)
                        }

                        beanstalk_in.destroy(jobid, function(err) {
                          if( err ) {
                            return seneca.log.error(
                              'listen', 'destroy', 'in', acttopic, 
                              jobid, payload, outstr, 
                              listen_options, seneca, err.stack||err)
                          }

                          process.nextTick(do_reserve)
                        })
                      })
                  })
                }
                else {
                  return process.nextTick(do_reserve)
                }
              })                
            }
            do_reserve()

          })
        })

      connect_fivebeans( seneca, beanstalk_in, 'listen', 'in', 
                         topic, listen_options )
    })

    done()
  }


  function hook_client_beanstalk( args, clientdone ) {
    var seneca         = this
    var type           = args.type
    var client_options = seneca.util.clean(_.extend({},options[type],args))

    tu.make_client( make_send, client_options, clientdone )

    function make_send( spec, topic, send_done ) {
      var beanstalk_in = make_fivebeans( client_options )

      beanstalk_in
        .on('connect', function() {
          var restopic = topic+'_res'
          var errhandler = 
                make_errhandler(seneca,'client','in',restopic,client_options)

          beanstalk_in.watch(restopic, function(err, numwatched) {
            if( err ) return errhandler('watch',err);

            function do_reserve() {
              beanstalk_in.reserve(function(err, jobid, payload) {
                if( err ) errhandler('reserve',err,jobid,payload);

                var data = tu.parseJSON( seneca, 'client-'+type, payload )
                if( data ) {
                  var complete = tu.handle_response( seneca, data, client_options )
                  
                  if( complete ) {
                    beanstalk_in.destroy(jobid,function(err) {
                      if( err ) errhandler('destroy',err,jobid,payload);
                      process.nextTick(do_reserve)
                    })
                  }
                  else {
                    beanstalk_in.release(jobid,100,0,function(err) {
                      if( err ) errhandler('release',err,jobid,payload);
                      process.nextTick(do_reserve)
                    })
                  }
                }
                else process.nextTick(do_reserve);
              })                
            }
            do_reserve()

          })
        })

      connect_fivebeans( seneca, beanstalk_in, 'listen', 'in', 
                         topic, client_options )



      var beanstalk_out = make_fivebeans( client_options )

      beanstalk_out
        .on('connect', function() {
          beanstalk_out.use(topic+'_act', function(err, numwatched) {
            if( err ) return send_done(err);

            var client = function( args, done ) {
              var outmsg = tu.prepare_request( this, args, done )
              var outstr = tu.stringifyJSON( seneca, 'client-beanstalk', outmsg )

              beanstalk_out.put(100,0,111,outstr, function(err,outjobid){
                if( err ) {
                  return seneca.log.error(
                    'client', 'put', 'out', topic+'_act', 
                    outjobid, outstr, 
                    client_options, seneca, err.stack||err)
                }
              })
            }

            send_done(null,client)
          })
        })

      connect_fivebeans( seneca, beanstalk_out, 'client', 'out', 
                         topic, client_options )
    }
  }  



  function make_fivebeans( opts ) {
    return new fivebeans.client( opts.host, opts.port )
  }


  function connect_fivebeans( seneca, instance, position, direction, topic, opts ) {
    instance
      .on('error', function(err) { 
        seneca.log.error( position, 'error', direction, topic, 
                          opts, seneca, err.stack||err)
      })
      .on('close', function() { 
        seneca.log.error( position, 'close', direction, topic, 
                          opts, seneca)
      })
      .connect()
  }


  function fivebeans_use_error( seneca, position, topic, opts, err ) {
    seneca.log.error(position, 'use', 'out', topic, 
                     opts, seneca, err.stack||err)
  }


  function make_errhandler( seneca, position, direction, fulltopic, opts ) {
    return function( what, err, xtra0, xtra1 ) {
      seneca.log.error( position, direction, what, fulltopic, 
                        opts, seneca, xtra0, xtra1, (err&&err.stack)||err)
    }
  }


  return {
    name: plugin,
  }
}
