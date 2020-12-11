const accountSid = "AC25511275cb52991c4a3ec10e5ca96424"
const authToken = "69d978174849e67a4086e103ff109826"
const my_number = "+16592342415"
const client = require('twilio')(accountSid, authToken);
const sendSms = async (number, message)=>{
client.messages
  .create({
     body: message,
     from: my_number,
     to: `+237${number}`
   })
  .then(message => console.log(message.sid))
  .catch(e=>console.log(e))
}
module.exports={
  sendSms
}