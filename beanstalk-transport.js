/* Copyright (c) 2014-2015 Richard Rodger, MIT License */
"use strict";


var buffer = require('buffer')
var util   = require('util')
var net    = require('net')
var stream = require('stream')


var _         = require('lodash')
var fivebeans = require('fivebeans')
var nid       = require('nid')


module.exports = function( options ) {
  var seneca = this
  var plugin = 'beanstalk-transport'

  var so = seneca.options()

  options = seneca.util.deepextend(
    {
      beanstalk: {
        timeout:   so.timeout ? so.timeout-555 :  22222,
        type:      'beanstalk',
        alivetime: 111,
        priority:  100,
        delay:     0,
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



  function make_error_handler( type, tag, instance ) {
    return function( note, err ) {
      if( instance.closed$ ) {
        seneca.log.error( type, tag, note, err, 'CLOSED' )
      }
      else {
        seneca.die( err, 'beanstalk', {type:type, tag:tag, note:note} )
      }
    }
  }


  function hook_listen_beanstalk( args, done ) {
    var seneca         = this
    var type           = args.type
    var listen_options = seneca.util.clean(_.extend({},options[type],args))

    tu.listen_topics( seneca, args, listen_options, function(topic) {
      var beanstalk_out = make_fivebeans( listen_options, 'listen-out' )
      var out_err       = make_error_handler( type, 'listen-out', beanstalk_out )

      beanstalk_out
        .on('connect', function() {
          beanstalk_out.use( topic+'_res', function(err, numwatched) {
            if( err ) return out_err('use',err);

            seneca.log.info('listen', 'connect', 'out', topic,
                            listen_options, seneca)
          })
        })

      connect_fivebeans( seneca, beanstalk_out, 'listen', 'out',
                         topic, listen_options, out_err )

      var beanstalk_in = make_fivebeans( listen_options, 'listen-in' )
      var in_err       = make_error_handler( type, 'listen-in', beanstalk_in )

      beanstalk_in
        .on('connect', function() {
          var acttopic = topic+'_act'

          beanstalk_in.watch(acttopic, function(err, numwatched) {
            if( err ) return in_err('watch/'+acttopic,err);

            function do_reserve() {
              if( beanstalk_in.closed$ ) return;

              beanstalk_in.reserve(function(err, jobid, payload) {
                if( err ) return in_err('reserve/'+jobid,err);

                var data = tu.parseJSON( seneca, 'listen-'+type, payload )
                if( data ) {
                  tu.handle_request( seneca, data, listen_options, function(out){
                    if( null == out ) return process.nextTick(do_reserve);

                    var outstr = tu.stringifyJSON( seneca, 'listen-'+type, out )

                    beanstalk_out.put(
                      listen_options.priority,
                      listen_options.delay,
                      listen_options.alivetime,
                      outstr,
                      function(err,outjobid) {
                        if( err ) return out_err('put',err);

                        beanstalk_in.destroy(jobid, function(err) {
                          if( err ) return in_err('destroy/'+jobid,err);

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
                         topic, listen_options, in_err )
    })

    done()
  }


  function hook_client_beanstalk( args, clientdone ) {
    var seneca         = this
    var type           = args.type
    var client_options = seneca.util.clean(_.extend({},options[type],args))

    tu.make_client( make_send, client_options, clientdone )

    function make_send( spec, topic, send_done ) {

      var beanstalk_in = make_fivebeans( client_options, 'client-in' )
      var in_err       = make_error_handler( type, 'client-in', beanstalk_in, in_err )

      beanstalk_in
        .on('connect', function() {
          var restopic = topic+'_res'

          beanstalk_in.watch(restopic, function(err, numwatched) {
            if( err ) return in_err('watch/'+restopic,err);

            function do_reserve() {
              if( beanstalk_in.closed$ ) return;

              beanstalk_in.reserve(function(err, jobid, payload) {
                if( err ) return in_err('reserve/'+jobid,err)

                var data = tu.parseJSON( seneca, 'client-'+type, payload )
                if( data ) {
                  var complete = tu.handle_response( seneca, data, client_options )

                  if( complete ) {
                    beanstalk_in.destroy(jobid,function(err) {
                      if( err ) return in_err('destroy/'+jobid,err)

                      process.nextTick(do_reserve)
                    })
                  }
                  else {
                    beanstalk_in.release(
                      jobid,
                      client_options.priority,
                      client_options.delay,
                      function(err) {
                        if( err ) return in_err('release/'+jobid,err)

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

      connect_fivebeans( seneca, beanstalk_in, 'client', 'in',
                         topic, client_options, in_err )


      var client

      var beanstalk_out = make_fivebeans( client_options, 'client-out' )
      var out_err       = make_error_handler( type, 'client-out', beanstalk_in )

      beanstalk_out
        .on('connect', function() {
          var acttopic = topic+'_act'

          beanstalk_out.use(acttopic, function(err, numwatched) {
            if( err ) return out_err('use/'+acttopic,err);

            var firsttime = !client

            client = function( args, done ) {
              var outmsg = tu.prepare_request( this, args, done )
              var outstr = tu.stringifyJSON( seneca, 'client-beanstalk', outmsg )

              try {
                beanstalk_out.put(
                  client_options.priority,
                  client_options.delay,
                  client_options.alivetime,
                  outstr,
                  function(err,outjobid){
                    if( err ) return out_err('put/'+outjobid,err);
                  })
              }
              catch(e) {
                if( e ) return out_err('put',e);
              }
            }
            client.id$ = nid()

            if( firsttime ) {
              send_done(null,function(args,done){
                client.call(this,args,done)
              })
            }
          })
        })

      connect_fivebeans( seneca, beanstalk_out, 'client', 'out',
                         topic, client_options, out_err )
    }
  }



  function make_fivebeans( opts, note ) {
    var client = new fivebeans.client( opts.host, opts.port )
    client.id$   = nid()
    client.note$ = note
    return client;
  }


  function connect_fivebeans( seneca, instance, position, direction,
                              topic, opts, errhandler ) {
    instance
      .on('error', function(err) {
        errhandler && errhandler(err)
      })
      .on('close', function() {
        seneca.log.error( position, 'close', direction, topic,
                          opts, seneca)
      })
      .connect()

    seneca.add('role:seneca,cmd:close',function( close_args, done ) {
      var closer = this

      instance.closed$ = true
      instance.end()
      closer.prior(close_args,done)
    })
  }


  return {
    name: plugin,
  }
}
