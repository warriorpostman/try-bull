const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-west-2'
});

// NOTE: SQS is (...practically) free!
// https://aws.amazon.com/sqs/pricing/

const SQS = new AWS.SQS({apiVersion: '2012-12-05'});
console.log(SQS !== undefined ? 'SQS is legit' : 'ergh');

module.exports = {
  // Reference to AWS SQS object
  SQSHandle: SQS,

  // List first queue attached to this account
  getQueue: () => {
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
};

