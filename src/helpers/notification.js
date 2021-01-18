require("dotenv").config();
var admin = require("firebase-admin");
const SMS_PARAM = {
        idSeller: 13,
        nameSeller: "FIRE BIBLE",
        keySeller: "HJGD54DG",
        secretSeller: "BJD45GFK",
        tokenSeller: "GHD4DFG45F"
    }
const axios = require("axios");
var serviceAccount = require("./hold-management-firebase-adminsdk-n26od-9514649214.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hold-management.firebaseio.com"
});

const notify = (data, topic) => {
  var message = {
    data,
    topic: `notification`
  };

  // Send a message to the device corresponding to the provided
  // registration token.
  admin
    .messaging()
    .send(message)
    .then((response) => {
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });
};
const Hashes = require('jshashes')
var SHA1 = new Hashes.SHA1
const sendSms = async (number, message, user, context) => {
  const timestamp =  Date.now()
  const signature = SHA1.hex_hmac(SMS_PARAM.secretSeller,`${SMS_PARAM.tokenSeller}${timestamp}`)
   /* axios
    .post("http://vas.avs-lab.com:8090/bulksms", {
      id: SMS_PARAM.idSeller,
      timestamp,
      schedule: "",
      signature ,
      phonenumber: `237${number}`,
      sms:message
    })
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.error(error);
    });  */
   
  await context.prisma.createNotification({ user: { connect: { id: user } }, message });
  notify(
    { bigText: message, message, title: "Bir Fuel Manager", subText: "Bir Fuel Manager" },
    number
  );
};

module.exports = {
  sendSms
};
