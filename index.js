var Hapi = require('hapi'); //Fetch the modules required to set up the server
var mqtt = require('mqtt'); //Fetch the modules required to establish the MQTT protocol

var server = new Hapi.Server(); //Set up a new Server
var port = Number(process.env.PORT || 3000); //Define the port no. NOTE: The default is 4444 for local servers otherwiser it is set by default from Heroku

//Set up the connection and define the variables
server.connection({
   port,
   routes: {
      cors: true }
  });

var client  = mqtt.connect('mqtt://test.mosquitto.org:1883'); //Set up a client which connects to the broker i.e. test.mosquitto.org on port 1883

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
      reply(deviceInfo);
      mqttPublish('device/control', deviceInfo, { //Publish the device info ot the topic which the ESP is subscribed to.
        'qos' : 2
      });
    }
  }
]);

server.start(() => {
  console.log(`Server set up on port ${port}`);
});
