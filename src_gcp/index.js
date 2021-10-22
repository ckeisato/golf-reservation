/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */

const puppeteer = require('puppeteer');
const util = require('./util');

const sleep = util.sleep;
const courses = util.courses;
const sendText = util.sendText;
const getNextWeekendDates = util.getNextWeekendDates;

const timeRegExp = new RegExp(`^(${process.env.HOUR}:([0-5][0-9])([AaPp][Mm]))`);

exports.findTimes = async (req, res) => {
  try {    
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        headless: true,
        timeout: 0
    });
    console.log("1 INIT BROWSER");

    const page = await browser.newPage();
    page.setViewport({
      width: 1200,
      height: 2000
    })
    await page.goto('https://foreupsoftware.com/index.php/booking/19765/2431#teetimes');
    console.log("2 VISITED PAGE");

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

    // select times
    await page.click("#page [data-value=all]");

    const dates = getNextWeekendDates();
    for (let j = 0; j < dates.length; j++) {
      console.log("3 LOOKING FOR TIMES");
      await page.evaluate(() => document.getElementById('date-field').value='');
      await page.type("#page #date-field", dates[j]);
      await page.$eval("#page #date-field", e => e.blur());

      // iterate through courses
      for (let i = 0; i < courses.length; i++) {
        // console.log("course", courses[i].name);
        await page.select("#page #schedule_select", String(courses[i].id));

        // select number of players
        await page.click(`#page [data-value='${String(process.env.PLAYERS)}']`);

        // get times
        await page.waitForTimeout(sleep);
        const timeElements = await page.$$("#page #times li h4.start");
        let times = await Promise.all(timeElements.map(
          item => page.evaluate(val => val.textContent, item)));
        console.log(`DEBUG: FOUND TIMES ${times}`);


        times = times.filter(item => timeRegExp.test(item));
        console.log('4 valid times', times);

        // send text
        if (times.length) {
          await sendText(dates[j], times, courses[i].name);
        }
      }
    }
    await browser.close();
  }
  catch(error){
    console.log(error);
  }
};
