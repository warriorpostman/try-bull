const SQSUtil = require('./sqs-util');

setTimeout(() => {
  console.log('Try reading');
  SQSUtil.getQueue().then(queueName => {
    SQSUtil.SQSHandle.receiveMessage({
      MaxNumberOfMessages: 10,
      QueueUrl: queueName,
      AttributeNames: [
        "SentTimestamp"
      ],
      MessageAttributeNames: [ "All" ],
      VisibilityTimeout: 0,
      WaitTimeSeconds: 0
    }, (err, data) => {
      if (err) {
        console.log('Problem receiving message: ', err);
      } else {
        if (data)
          console.log('Got the message:', JSON.stringify(data, null, '  '));
        else 
          console.log('No data received!');
      }
      console.log(`*** Received ${data.Messages ? data.Messages.length : 0} messages ***`);
    });
    
  }).catch(err => console.log('Receive ERR', err));
}, 1000);
