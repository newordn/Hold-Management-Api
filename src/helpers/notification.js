const accountSid = "AC25511275cb52991c4a3ec10e5ca96424"
const authToken = "0e6ecca3524ca0e009f6199cc0c40f76"
const my_number = "+16592342415"
const client = require('twilio')(accountSid, authToken);
var topic = 'notification'
var admin = require("firebase-admin");

var serviceAccount = require("./hold-management-firebase-adminsdk-n26od-9514649214.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hold-management.firebaseio.com"
});

const notify = (data, topic)=>{
  
var message = {
    data ,
    topic,
  };
  
  // Send a message to the device corresponding to the provided
  // registration token.
  admin.messaging().send(message)
    .then((response) => {
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    })
}
const sendSms = async (number, message,user, context)=>{
client.messages
  .create({
     body: message,
     from: my_number,
     to: `+237${number}`
   })
  .then(message => console.log(message.sid))
  .catch(e=>console.log(e))
   await context.prisma.createNotification({user: {connect: {id: user}}, message})
   notify({bigText:message, message, title: 'Bir Hold Management', subText:'Bir Hold Management'}, number)
}

module.exports={
  sendSms
}