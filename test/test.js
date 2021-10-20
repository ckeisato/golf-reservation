// const singleDay = 86400000;

// const formatDate = date => `${(date.getMonth() + 1)}-${date.getDate()}-${date.getFullYear()}`;

// const getNextWeekendDates = (today) => {
//   // const today = new Date();

//   // today is Saturday, just return next Saturday
//   if (today.getDay() == 6) {
//     const nextSaturday = new Date(today.getTime() + 7 * singleDay);
//     return [formatDate(nextSaturday)];
//   }

//   return [
//     formatDate(new Date(today.getTime() + singleDay * Math.abs(6 - today.getDay()))),
//     formatDate(new Date(today.getTime() + singleDay * Math.abs(7 - today.getDay()))),
//   ]
// }


// const test = getNextWeekendDates(new Date('6-2-2021'));
// console.log(test);

const util = require('./util');

util.mytest();