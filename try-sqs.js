const AWS = require('aws-sdk');

var params = {
  QueueNamePrefix: 'test-qbo-purchase'
};


AWS.config.update({
  region: 'us-west-2'
});

const SQS = new AWS.SQS({apiVersion: '2012-12-05'});
console.log(SQS !== undefined ? 'SQS is legit' : 'ergh');

SQS.listQueues(params, function (err, data) {
  if (err) {
    console.log(err, err.stack);
  } else {
    console.log('List Queue Results:', data)

    SQS.sendMessage({
      MessageBody: 'Information relevant to your enterprise',
      DelaySeconds: 1,
      QueueUrl: data.QueueUrls[0],
      DelaySeconds: 0,
      MessageAttributes: {
        ImportantTidbit: {
          DataType: 'String',
          StringValue: 'Juicy details about yo business'
        }
      },
      MessageDeduplicationId: '1234567890',
      MessageGroupId: 'message_group_id'
    }, (err, data) => {
      console.log('sent the message', data ? data.MessageId : 'no data callback on send');
    });

    SQS.receiveMessage({
      MaxNumberOfMessages: 10,
      QueueUrl: data.QueueUrls[0],
      AttributeNames: [
        "SentTimestamp"
      ],
      MessageAttributeNames: [ "All" ],
    }, (err, data) => {
      if (err) {
        console.log('Problem receiving message: ', err);
      } else {
        console.log('Got the message:', { data });
        console.log('Got the body:', data.body );
      }

    });
  }
});

