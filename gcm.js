const FCM = require('fcm-node');

var serverKey = 'AAAABQOxwBg:APA91bGFt3Fx_JSGmLbZX-w8o7vS8KV-MJHlZNzJvh0zTXNDBoYUjTUi_d3sHkQTkJO3SgwsyTNLj3W9o8Quhi2d_CzpYqMBJyri9QtvFqnP9eLJurKlgtybs4Mn8Ms6i2xiMN9UMxgW';

var fcm = new FCM(serverKey);

// var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
//     to: '/topics/global',
//     // collapse_key: 'your_collapse_key'
//
//     notification: {
//         title: 'Test',
//         body: 'Hello world'
//     },
//
    // data: {  //you can send only notification or only data(or include both)
    //     my_key: 'my value',
    //     my_another_key: 'my another value'
    // }
// };

var pushnotification = (title, message) => {
fcm.send({ //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    // to: '/topics/global',
    to: 'elvsLfIB098:APA91bG_RP8Dhys0lnQNZm8IXnnHPQNTSzGO-Tx9DLUxWCV8yOXNeOBr-1ztT4L06znoaarHO20sZygmO1aGd2tlk1Kul8zAfKjG_m82pM0ext8Dp_vFAb6ePWYW7QqCIf2f0XFXEEKr',
    notification: {
        title: title,
        body: message
      },
      data: {  //you can send only notification or only data(or include both)
          "deviceNum": 1,
          // my_another_key: 'my another value'
      }
    },
    function(err, response){
    if (err) {
        console.log("Something has gone wrong!");
    } else {
        console.log("Successfully sent with response: ", response);
    }
});
};

module.exports = {
  pushnotification
}
