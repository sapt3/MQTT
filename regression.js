//NOTE: The child parent process here
//NOTE: This block of code runs periodically and will only be run every hour
const execFile = require('child_process').exec;
const fcm = require('./gcm');



var start = (data) => {

  var child = execFile('java -jar ./test.jar "Hello again"', (err, stdout, stderr) => {
    if(err === null){
      console.log('Output ->' + stdout);
      fcm.pushnotification("Tangible Internet", stdout);

    }
    console.log("Runtime Error -> " + stderr);
    console.log("Error -> " + err);
    fcm.pushnotification("Tangible Internet", stderr + err);
  });
// const child = execFile('regression.exe', [data], (error, stdout, stderr) => {
//   if (error) {
//     throw error;
//   }
//
//   if(stderr) {
//     // throw stderr;
//     console.log(stderr);
//   }
//   //after error handling is done
//
//   var output = stdout;
//   return output;
//
// });
};


module.exports = {
  start
};
