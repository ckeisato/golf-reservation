const twilio = require("twilio");
const dotenv = require("dotenv");
dotenv.config();

// const sendText = async function(times, course) {
//   const accountSid = process.env.TWSID;
//   const authToken = process.env.TWATOKEN;
//   const client = twilio(accountSid, authToken);

//   client.messages.create({
//      body: `\nAVAILABLE TIMES\n${course}\n${times}`,
//      from: process.env.NUMBERFM,
//      to: process.env.NUMBERTO
//    })
//   .then(message => console.log(message.sid));
// }


const sendText = async function(times, course) {
  const accountSid = process.env.TWSID;
  const authToken = process.env.TWATOKEN;
  const client = twilio(accountSid, authToken);

  client.messages.create({
     body: `\nAVAILABLE TIMES\n${course}\n${times}`,
     from: process.env.NUMBERFM,
     to: process.env.NUMBERTO
   })
  .then(message => console.log(message.sid));
}


sendText(["1:00"], "Test course");

