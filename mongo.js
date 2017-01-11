const mongodb = require('mongodb'); //Require the package for MongoDB support.

//Define the mongo variables and paths
var mongodClient = mongodb.MongoClient; //Create a mongodb client to connect to the server
var mongodbURI = 'mongodb://super:abcd@ds157288.mlab.com:57288/heroku_8wjc36dr';
// var mongodbURI = 'mongodb://localhost:27017';


var updateDB = (num, command) => {

    mongodClient.connect(mongodbURI, (err, db) => {
    if(!err) { //If connected sucessfully
      var collection = db.collection('device-state'); //Connect to collection named 'device-state'
      var data = JSONformatter(num, command);
      collection.insert([data]); //Update the DB
      return 1;
    } //end of if
    else {
      return 0;
    } //end of else
  });
};

//Functio to convert the data to a format which can be usable to store data to the DB
var JSONformatter = (number, command) => {
  var structuredData = {
    deviceNum : number,
    command : command,
    time: new Date() //Time stamp the result.
  };
  return structuredData;
};


module.exports = {
  updateDB,
  JSONformatter
};
