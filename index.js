const Hapi = require('hapi'); //Fetch the modules required to set up the server
const mqtt = require('mqtt'); //Fetch the modules required to establish the MQTT protocol
const file = require('./file-system');
const regression = require('./regression');
const mongo = require('./mongo');
const fcm = require('./gcm');

var server = new Hapi.Server(); //Set up a new Server
var port = Number(process.env.PORT || 4444); //Define the port no. NOTE: The default is 4444 for local servers otherwiser it is set by default from Heroku

//Set up the connection and define the variables
server.connection({
   port,
   routes:
   { cors: true }
  });

var client  = mqtt.connect('mqtt://hc.iandwe.in'); //Set up a client which connects to the broker i.e. test.mosquitto.org on port 1883

//NOTE: Function declaration for publish to broker
var mqttPublish = (topic, msg) => {
  client.publish(topic, msg, () => {
    console.log('Message sent: ' + msg);
  });
}

server.route([
  {
    method: 'POST',
    path: '/device/control',
    handler: (request, reply) => {

      var deviceNumber = request.payload.deviceNum;
      var command = request.payload.command;
      var deviceInfo = `dev${deviceNumber}-${command}`; //eg - 'dev1-on'
      // console.log(deviceInfo);
      reply(deviceInfo); //We're recieving tje same output, consider this as feedback
      console.log(deviceInfo);
      mqttPublish('device/control', deviceInfo, { //Publish the device info ot the topic which the ESP is subscribed to.
        'qos' : 2 //qos 2 is the highest level of quality service possible which ensures sure delivery
        });
      // console.log(deviceInfo);
      //Save the data to the connected MongoDB (mLAb)
      if(mongo.updateDB(deviceNumber, command)){ //If data saved succesfully
        console.log("Saved to the database successfully");
      }
      else {
        console.log("Error while saving to the database");
      }
      var savedData = mongo.JSONformatter(deviceNumber,command);
      file.saveData(savedData);
    }// end of handler
  }
]);

// var list = mongo.devicelist();
// console.log(list.toString());
// var list = [];
// if(!mongo.devicelist()){
//   list = mongo.devicelist();
//   console.log(list.toString());
// }
regression.start();
fcm.pushnotification("Tangible Internet", "Your device usually stays off now. Turn off?");
// setInterval((data) => {
//   mongo.devicelist();
// }, 1000)
// regression.start(database);

server.start(() => {
  console.log(`Server set up on ${port}`);
});
