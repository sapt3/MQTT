const mongodb = require('mongodb'); //Require the package for MongoDB support.
const fs = require('fs');
//Define the mongo variables and paths
var mongodClient = mongodb.MongoClient; //Create a mongodb client to connect to the server
var mongodbURI = 'mongodb://super:abcd@ds157288.mlab.com:57288/heroku_8wjc36dr';
// var mongodbURI = 'mongodb://localhost:27017';

var length = 0;
var finalList = [];
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
  // String time = new Date().
  var structuredData = {
    deviceNum : number,
    command : command,
    time: new Date() //Time stamp the result.
  };
  return structuredData;
};

var devicelist = () =>{
  mongodClient.connect(mongodbURI, (err, db) => {
    if(!err){
      db.collection('device-state', (err, collection) =>{
        if(!err){

          collection.find().toArray((err, docs) =>{
            if(!err){
              length = docs.length;
              var rawlist = [];
              for(var i = 0; i < length; i++)
              rawlist.push(docs[i].deviceNum);

              // finalList = rawlist.filter(function(item, i, ar){ return ar.indexOf(item) === i; })
              var list = [];
              list = unique(rawlist);

              console.log(list.toString());
              // callback(return list);
              // for(i=1;i<100;i++)
              structure();
              return list;

            }
          });

        }
      });

    }
  });
};

var structure = () => {


  mongodClient.connect(mongodbURI, (err, db) =>{
    if(!err){
      db.collection('device-state', (err, collection) =>{
        if(!err){
          // for(var i=1;i <num; i++){
          collection.find({
            'deviceNum': "10"
          }).toArray((err, docs) => {
            if(!err){
              // for(i=0; i<docs.length; i++)
              console.log(docs.length);
              for(i=0; i<docs.length; i++){
                console.log(docs[i].time);
                if(docs[i].command === "on")
                  fs.appendFile('switch-state.txt',docs[i].time.toString() + ",1\n");
                else if (docs[i].command === "off")
                  fs.appendFile('switch-state.txt',docs[i].time.toString() + ",0\n");
              }
            }
          });

          // collection.find({
          //   'deviceNum': 2
          // }).toArray((err, docs) => {
          //   if(!err){
          //     // for(i=0; i<docs.length; i++)
          //     // console.log(docs[i].time);
          //     console.log(docs.length);
          //     for(i=0; i<docs.length; i++){
          //       console.log(docs[i].time);
          //       if(docs[i].command === "on")
          //         fs.writeFileSync('switch-state.txt',`${docs[i].time},1`);
          //       else (docs[i].command === "off")
          //         fs.writeFileSync('switch-state.txt',`${docs[i].time},0`);
          //     }
          //   }
          // });
        // }
        }
      })
    }
  })
};

function unique(arr) {
    var uniq = {};
    arr.forEach(function(item) { uniq[item] = true; });
    return Object.keys(uniq);
};

module.exports = {
  updateDB,
  JSONformatter,
  devicelist,
  structure
};
