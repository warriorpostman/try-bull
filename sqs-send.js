const SQSUtil = require('./sqs-util');


SQSUtil.getQueue().then(queueName => {
  for (var j = 0; j < 2; j++) {
    SQSUtil.SQSHandle.sendMessage({
      MessageBody: 'Information relevant to your enterprise ' + Date.now(),
      DelaySeconds: 0,
      QueueUrl: queueName,
      MessageAttributes: {
        'ImportantTidbit': {
          DataType: 'String',
          StringValue: 'Juicy details about yo business'
        }
      },
    }, (err, data) => {
      if (err) {
        console.log(err);
      }
      console.log('Sent the message', data ? data.MessageId : 'no data callback on send');
    });

  }
}).catch(err => console.log('Send ERR', err));


