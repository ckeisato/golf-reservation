
const {
  Builder,
  By,
  Key,
  until
} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { stalenessOf, elementsLocated } = require('selenium-webdriver/lib/until');
const twilio = require('twilio');


// local development
const dotenv = require("dotenv");
dotenv.config();

console.log(process.env.BPUSER)


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

// user defined
const date = "05-19-2021";
const hour = "5";
const meridian = "pm";

(async function myFunction() {
    // headless
    // let driver = await new Builder()
    //   .forBrowser('chrome')
    //   .setChromeOptions(new chrome.Options().headless().windowSize(screen))
    //   .build();

    // not headless
    const driver = await new Builder()
      .forBrowser('chrome')
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

    await selectCourse(driver, '');

  
    const datePicker = await driver.findElement(By.id("date-field"));
    await driver.executeScript("document.getElementById('date-field').value=''");
    datePicker.sendKeys(date, Key.ENTER);

    const test = await selectTimes(driver);
    console.log(test);



    console.log(2);






    // driver.close();
    // driver.quit();
})();



// returns true or false
// if there are no times => return false
// if there are times
//   check if within the hour, get times and send, return true
//   if not within the hour, return false
const selectTimes = async function(driver) {
    try {
      await driver.wait(until.elementsLocated(By.className("loading")), 1000);
      const loading = await driver.findElements(By.className("loading"));
      await driver.wait(until.stalenessOf(loading[0] || null), 100);
    } catch (error) {
      console.log(error);
    };

    const times = await driver.findElement(By.id("times"));
    const text = await times.getText();
    const noTimes = text.includes(noTimesAvailable);
    if (noTimes) {
        console.log('no times available');
        return false;
    }

    // find li with times classname
    const timesItems = await times.findElements(By.xpath(`//h4[contains(text(),${hour})]`))

    // book time
    if (timesItems.length) {
      await Promise.all(timesItems.map(async item => console.log(await item.getText())));
      await sendText('');
      return true;
    }

    return false;
};

// changes the course drop down
const selectCourse = async function(driver, course) {
    const select = await driver.findElement(By.xpath("//option[contains(text(), 'Bethpage Blue Course')]"));
    await select.click();
};


const sendText = async function(times) {
  const accountSid = process.env.TWSID;
  const authToken = process.env.TWATOKEN;
  const client = twilio(accountSid, authToken);

  client.messages
  .create({
     body: "TEST TEST",
     from: process.env.NUMBERFM,
     to: process.env.NUMBERTO
   })
  .then(message => console.log(message.sid));
}