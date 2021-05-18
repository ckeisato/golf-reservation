
const {
  Builder,
  By,
  Key,
  until
} = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { stalenessOf, elementsLocated } = require("selenium-webdriver/lib/until");
const twilio = require("twilio");


// local development
const dotenv = require("dotenv");
dotenv.config();


const screen = {
  width: 1440,
  height: 900
};

const sleep = 700;
const noTimesAvailable = "Use Time/Day filters to find desired teetime";
const courses = [
    "Bethpage Black Course",
    "Bethpage Blue Course",
    "Bethpage Green Course",
    "Bethpage Red Course",
    "Bethpage Yellow Course"
];

const meridian = "pm";

(async function myFunction() {
    // headless
    // let driver = await new Builder()
    //   .forBrowser('chrome')
    //   .setChromeOptions(new chrome.Options().headless().windowSize(screen))
    //   .build();

    // // not headless
    const driver = await new Builder()
      .forBrowser("chrome")
      .build();


    // navigate main page
    await driver.get('https://foreupsoftware.com/index.php/booking/19765/2431#teetimes');
    const resident = await driver.findElement(By.xpath("//button[contains(text(),'Resident')]"));
    await resident.click();
    const login = await driver.findElement(By.className("login"));

    await login.click();

    // login modal
    await driver.wait(until.elementLocated(By.id("login"), 100));
    const email = await driver.findElement(By.id("login_email"));
    const password = await driver.findElement(By.id("login_password"));


    // enter credentials
    email.sendKeys(process.env.BPUSER);
    password.sendKeys(process.env.BPPASS);

    const modal = await driver.findElement(By.id("login"));
    const loginButton = await modal.findElement(By.className("login"));

    // recapta
    await driver.sleep(sleep);
    await loginButton.click();

    // navigate to reservations
    await driver.sleep(sleep);
    await driver.wait(until.elementLocated(By.xpath("//a[@href='#/teetimes']", 100)));

    const reservations = await driver.findElement(By.xpath("//a[@href='#/teetimes']"));
    await reservations.click();
  

    // select morning times
    // const morning = await driver.findElement(By.xpath("//a[@data-value='morning']"));
    // await morning.click();

    // set date
    const datePicker = await driver.findElement(By.id("date-field"));
    await driver.executeScript("document.getElementById('date-field').value=''");
    datePicker.sendKeys(process.env.DATE, Key.ENTER);

    // iterate through courses
    for (let i = 0; i < courses.length; i++) {
        await selectCourse(driver, courses[i]);

        const times = await getTimes(driver);
        console.log(times); 
        if (times.length) {
            console.log('there are times');
            console.log(`sending text for ${courses[i]} ${times}`);
            await sendText(times, courses[i]);
        }
    }

    driver.close();
    driver.quit();
})();

// selects date
// finds if times are available
// if no times => return []
// if times => return array of times
const getTimes = async function(driver) {
    await driver.sleep(sleep);
    const times = await driver.findElement(By.id("times"));
    const text = await times.getText();
    const noTimes = text.includes(noTimesAvailable);
    if (noTimes) {
        console.log('no times available');
        return [];
    }

    // find li with times classname
    const timesItems = await times.findElements(By.xpath(`//h4[contains(text(),${process.env.HOUR})]`))

    // book time
    if (timesItems.length) {
      const openTimes = await Promise.all(timesItems.map(async item => await item.getText()));
      return openTimes;
    }

    return [];
};

// changes the course drop down
const selectCourse = async function(driver, course) {
    console.log(`selecting course ${course}`);
    const select = await driver.findElement(By.xpath(`//option[contains(text(), '${course}')]`));
    await select.click();
};

const sendText = async function(times, course) {
  const accountSid = process.env.TWSID;
  const authToken = process.env.TWATOKEN;
  const client = twilio(accountSid, authToken);

  client.messages
  .create({
     body: `\nAVAILABLE TIMES\n${course}\n${times}`,
     from: process.env.NUMBERFM,
     to: process.env.NUMBERTO
   })
  .then(message => console.log(message.sid));
}