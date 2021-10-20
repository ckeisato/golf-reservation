const twilio = require("twilio");

exports.courses = [
  {
    name: "Bethpage Blue Course",
    id: "2433"
  },
  {
    name: "Bethpage Black Course",
    id: "2431",
  },
  {
    name: "Bethpage Green Course",
    id: "2434"
  },
  {
    name: "Bethpage Red Course",
    id: "2432"
  },
  {
    name: "Bethpage Yellow Course",
    id: "2435"
  }
];

exports.sleep = 700;

exports.sendText = async function(date, times, course) {
  const accountSid = process.env.TWSID;
  const authToken = process.env.TWATOKEN;
  const client = twilio(accountSid, authToken);

  client.messages.create({
     body: `\nAVAILABLE TIMES\n${date}\n${course}\n${times}`,
     from: process.env.NUMBERFM,
     to: process.env.NUMBERTO
   })
  .then(message => console.log(message.sid));
}

const formatDate = date => `${(date.getMonth() + 1)}-${date.getDate()}-${date.getFullYear()}`;

exports.getNextWeekendDates = () => {
  const singleDay = 86400000;
  const today = new Date();

  // today is Saturday, just return next Saturday
  if (today.getDay() == 6) {
    const nextSaturday = new Date(today.getTime() + 7 * singleDay);
    return [formatDate(nextSaturday)];
  }

  return [
    formatDate(new Date(today.getTime() + singleDay * Math.abs(6 - today.getDay()))),
    formatDate(new Date(today.getTime() + singleDay * Math.abs(7 - today.getDay()))),
  ]
}