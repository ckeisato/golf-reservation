const puppeteer = require('puppeteer');
const dotenv = require("dotenv");
dotenv.config();

const sleep = 700;
const noTimesAvailable = "Use Time/Day filters to find desired teetime";
const courses = [
  2433, // "Bethpage Blue Course",
  2431, // "Bethpage Black Course",
  2434, // "Bethpage Green Course",
  2432, // "Bethpage Red Course",
  2435, // "Bethpage Yellow Course"
];

const meridian = "pm";

(async () => {
  // const browser = await puppeteer.launch();
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
  await page.waitForTimeout(1000);
  await page.click("#login .modal-footer button.btn")
  await page.waitForSelector("#login", { hidden: true });

  // go to tee times page
  await page.waitForTimeout(1000);
  await page.click("#page .btn");

  // select morning times
  // await page.click("#page [data-value=morning]");

  // select date
  await page.evaluate(() => document.getElementById('date-field').value='');
  await page.type("#page #date-field", process.env.DATE);
  await page.keyboard.press("Enter");  
  // iterate through courses
  for (let i = 0; i < courses.length; i++) {

    console.log("course", courses[i]);
    // set course
    await page.evaluate((course) => {
      document.querySelector(`#page #schedule_select [value='${course}']`).setAttribute("selected", true);
    }, courses[i]);

    // get times
    await page.waitForTimeout(sleep);
    const timeElements = await page.$$("#page #times li h4.start");
    const times = await Promise.all(timeElements.map(
      item => page.evaluate(val => val.textContent, item)));

    console.log(times);


  }

})();

