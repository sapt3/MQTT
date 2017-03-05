//NOTE: The child parent process here
//NOTE: This block of code runs periodically and will only be run every hour
const execFile = require('child_process').exec;


var start = (data) => {

  var child = execFile('java -jar ./test.jar "This is project tangible internet', (err, stdout, stderr) => {
    if(err === null){
      console.log('Output ->' + stdout);
    }
    console.log('Error ->' + stderr);
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
