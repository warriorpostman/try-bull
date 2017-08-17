const amqp = require('amqplib/callback_api');

// NOTE: This example is from RabbitMQ's website: 
// https://www.rabbitmq.com/tutorials/tutorial-one-javascript.html
amqp.connect('amqp://localhost:32768', (err, conn) => {
  if (err) {
    console.log('Cannot connect to RabbitMQ - Is config wrong? Is it down?', { err });
    process.exit(0);
    return;
  }
  conn.createChannel(function(err, ch) {
    var q = 'hello';

    ch.assertQueue(q, {durable: false});

    for (var x = 0; x < 20; x++) {
      ch.sendToQueue(q, new Buffer('Hello ' + x));
      console.log(" [x] sent 'Hello World!'");
    }
  });

  setTimeout( function() {
      conn.close();
      process.exit(0); 
    },
    500
  );
});


