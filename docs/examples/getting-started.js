// Run with beanstalkd on 127.0.0.1:11400 (npm run services:up).
const Seneca = require('seneca')

// In your own project: require('seneca-beanstalk-transport')
const BeanstalkTransport = require('../..')

const HOST = process.env.SENECA_TEST_BEANSTALK_HOST || '127.0.0.1'
const PORT = parseInt(process.env.SENECA_TEST_BEANSTALK_PORT || '11400', 10)

const service = Seneca({ log: 'silent' })
  .use('seneca-transport')
  .use(BeanstalkTransport)
  .add('role:math,cmd:sum', function (msg, reply) {
    reply({ answer: msg.left + msg.right })
  })
  .listen({ type: 'beanstalk', host: HOST, port: PORT, pin: 'role:math,cmd:*' })

service.ready(function () {
  const client = Seneca({ log: 'silent' })
    .use('seneca-transport')
    .use(BeanstalkTransport)
    .client({ type: 'beanstalk', host: HOST, port: PORT, pin: 'role:math,cmd:*' })

  client.ready(function () {
    client.act('role:math,cmd:sum,left:1,right:2', function (err, out) {
      if (err) throw err
      console.log('sum:', out.answer)
      client.close(function () {
        service.close(function () {
          console.log('closed')
        })
      })
    })
  })
})
