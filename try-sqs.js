const AWS = require('aws-sdk');

// var params = {
//   QueueNamePrefix: 'test-qbo-purchase'
// };


AWS.config.update({
  region: 'us-west-2'
});

const SQS = new AWS.SQS({apiVersion: '2012-12-05'});
console.log(SQS !== undefined ? 'SQS is legit' : 'ergh');

function getQueue() {
  return new Promise((resolve, reject) => {
    const params = {
      QueueNamePrefix: 'test-qbo-purchase'
    };

    SQS.listQueues(params, function (err, data) {
      if (err) {
        console.log(err, err.stack);
        reject(err);
      } else {
        if (data.QueueUrls) {
          resolve(data.QueueUrls[0]);
        } else {
          reject(new Error('No data found'));
        }
      }
    });

  })
}

getQueue().then(queueName => {
  for (var j = 0; j < 2; j++) {
    SQS.sendMessage({
      MessageBody: 'Information relevant to your enterprise ' + j,
      DelaySeconds: 0,
      QueueUrl: queueName,
      MessageAttributes: {
        'ImportantTidbit': {
          DataType: 'String',
          StringValue: 'Juicy details about yo business'
        }
      },
      // MessageDeduplicationId: 'dedupe_' + Date.now(),
      MessageGroupId: 'message_group_id' + j
    }, (err, data) => {
      if (err) {
        console.log(err);
      }
      console.log('Sent the message', data ? data.MessageId : 'no data callback on send');
    });

  }
}).catch(err => console.log('Send ERR', err));

setTimeout(() => {
  getQueue().then(queueName => {
    SQS.receiveMessage({
      MaxNumberOfMessages: 2,
      QueueUrl: data.QueueUrls[0],
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
        console.log('Got the message:', { data });
      }

    }).catch(err => console.log('Receive ERR', err));
  });
}, 1000);
