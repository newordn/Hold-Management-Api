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
var hmacsha1 = require('hmacsha1');
var serviceAccount = require("./hold-management-firebase-adminsdk-n26od-9514649214.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hold-management.firebaseio.com"
});

const notify = (data, topic) => {
  var message = {
    data,
    topic
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
const sendSms = async (number, message, user, context) => {
  const timestamp =  Date.now()
  axios
    .post("vas.avs-lab.com:8090/bulksms", {
      timestamp,
      schedule: "",
      signature: hmacsha1(SMS_PARAM.tokenSeller+ timestamp,SMS_PARAM.secretSeller) ,
      phonenumber: number,
      sms:message
    })
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.error(error);
    });
  await context.prisma.createNotification({ user: { connect: { id: user } }, message });
  notify(
    { bigText: message, message, title: "Bir Hold Management", subText: "Bir Hold Management" },
    number
  );
};

module.exports = {
  sendSms
};
