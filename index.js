Queue = require('bull');

const jobQueue = new Queue('a job queue', 'redis://127.0.0.1:6379');

jobQueue.process((job, done) => {
  setTimeout(() => { 
    console.log('JOB', job.data);
    // console.log('job:', job.name);
    done();
  }, 1000)
});

jobQueue.add({name: 'stuff'});
jobQueue.add({name: 'more'});
jobQueue.add({name: 'again'});

// if (jobQueue.start) {
//   jobQueue.start();
// }

console.log('what up');
