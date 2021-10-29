const puppeteer = require('puppeteer');
const util = require('./util');

const dotenv = require("dotenv");
dotenv.config();

console.log(process.env.NUMBERTO);
console.log(process.env.HOUR)

const sleep = util.sleep;
const courses = util.courses;
const sendText = util.sendText;
const getNextWeekendDates = util.getNextWeekendDates;

const timeRegExp = new RegExp(`^(${process.env.HOUR}:([0-5][0-9])([AaPp][Mm]))`);

(async () => {
  const browser = await puppeteer.launch({
    headless: false
  });

  const page = await browser.newPage();
  page.setViewport({
    width: 1200,
    height: 2000
  })
  await page.goto('https://foreupsoftware.com/index.php/booking/19765/2431#teetimes');

  await page.click("#page button.btn-primary");
  await page.waitForSelector("#page button.login");
  await page.click("#page button.login");

  await page.type("#login_email", process.env.BPUSER);
  await page.type("#login_password", process.env.BPPASS);
  await page.waitForTimeout(sleep);
  await page.click("#login .modal-footer button.btn")
  await page.waitForSelector("#login", { hidden: true });

  // go to tee times page
  await page.waitForTimeout(sleep);
  await page.click("#page .btn");

  // select morning times
  // await page.click("#page [data-value=morning]");
    await page.click("#page [data-value=all]");


  const dates = getNextWeekendDates();
  for (let j = 0; j < dates.length; j++) {
    await page.evaluate(() => document.getElementById('date-field').value='');
    await page.type("#page #date-field", dates[j]);
    await page.$eval("#page #date-field", e => e.blur());

    // iterate through courses
    for (let i = 0; i < courses.length; i++) {
      console.log("course", courses[i].name);
      await page.select("#page #schedule_select", String(courses[i].id));

      // select number of players
      await page.click(`#page [data-value='${String(process.env.PLAYERS)}']`);

      // get times
      await page.waitForTimeout(sleep);
      const timeElements = await page.$$("#page #times li h4.start");
      let times = await Promise.all(timeElements.map(
        item => page.evaluate(val => val.textContent, item)));
      console.log(times);


      times = times.filter(item => timeRegExp.test(item));
      console.log('valid times', times);

      // send text
      if (times.length) {
        console.log("Sending text", times, courses[i].name);
        await sendText(dates[j], times, courses[i].name);
      }
    }
  }

  await browser.close();
})();

