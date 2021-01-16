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
var hmacsha1Generate = require('hmacsha1-generate');
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
  const timestamp =  1212
  const signature = hmacsha1Generate.generateSignature(SMS_PARAM.secretSeller,SMS_PARAM.tokenSeller+ timestamp)
  console.log(signature)
  axios
    .post("vas.avs-lab.com:8090/bulksms", {
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
    });
  await context.prisma.createNotification({ user: { connect: { id: user } }, message });
  notify(
    { bigText: message, message, title: "Bir Fuel Manager", subText: "Bir Fuel Manager" },
    number
  );
};

module.exports = {
  sendSms
};
