Queue = require('bull');

const uno = new Queue('UNO queue', 'redis://127.0.0.1:6379');
const dos = new Queue('DOS queue', 'redis://127.0.0.1:6379');

uno.empty();
dos.empty();

uno.process((job, done) => {
  setTimeout(() => { 
    console.log('Running...', { jobData: job.data, queue: job.queue.name});
    done();
  }, 2000)
});

dos.process((job, done) => {
  setTimeout(() => { 
    console.log('Running...', { jobData: job.data, queue: job.queue.name});
    done();
  }, 1500)
});

dos.on('completed', (job, result) => {
  console.log('completed', job.data);
});

uno.on('error', onFail);

function onFail(job, err) {
  console.log(`JOB [${job.data}] failed with ${err}`);
}

uno.on('resumed', function(job){
  console.log('Resuming ', job.data);
  // The queue has been resumed.
})

uno.add({name: '1'});
uno.add({name: '2'});
uno.add({name: '3'});
uno.add({name: '4'});
uno.add({name: '5'});
uno.add({name: '6'});
uno.add({name: '7'});
uno.add({name: '8'});

dos.add({name: 'A'});
dos.add({name: 'B'});
dos.add({name: 'C'});

console.log('what up');
