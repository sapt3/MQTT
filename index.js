const Hapi = require('hapi'); //Fetch the modules required to set up the server
const mqtt = require('mqtt'); //Fetch the modules required to establish the MQTT protocol
const mongodb = require('mongodb');


var mongodClient = mongodb.MongoClient;
var mongodbURI = 'mongodb://super:abcd@ds157288.mlab.com:57288/heroku_8wjc36dr';

var server = new Hapi.Server(); //Set up a new Server
var port = Number(process.env.PORT || 4444); //Define the port no. NOTE: The default is 4444 for local servers otherwiser it is set by default from Heroku

//Set up the connection and define the variables
server.connection({
   port,
   routes: {
      cors: true }
  });

var client  = mqtt.connect('mqtt://hc.iandwe.in'); //Set up a client which connects to the broker i.e. test.mosquitto.org on port 1883

//function declaraation
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
      var deviceInfo = 'dev' + request.payload.deviceNum + '-' + request.payload.command; //eg - 'dev1-on'
      console.log(deviceInfo);

      // db.collection.insert(request.payload);
      // db.collection.insert(request.payload.command);

      reply(deviceInfo);
      mqttPublish('device/control', deviceInfo, { //Publish the device info ot the topic which the ESP is subscribed to.
        'qos' : 2
        });


        // console.log(deviceInfo);
        mongodClient.connect(mongodbURI, (err, db) => {
          if(!err) {
            console.log("Connected..");
            var collection = db.collection('device-state');
            var deviceParam = {
              deviceNum : request.payload.deviceNum,
              command : request.payload.command,
              time: new Date()
            }
            collection.insert([deviceParam]);
          }else {
            console.log("Error");
          }
        });


    }
  }
]);

server.start(() => {
  console.log(`Server set up on ${port}`);
});
