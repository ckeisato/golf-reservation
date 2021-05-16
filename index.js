
const {
  Builder,
  By,
  Key,
  until
} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

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
const date = "05-22-2021";
const hour = "7";

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
    email.sendKeys("ckeisato@gmail.com");
    password.sendKeys("golfgolf");

    const modal = await driver.findElement(By.id("login"));
    const loginButton = await modal.findElement(By.className("login"));

    // recapta
    await driver.sleep(sleep);
    await loginButton.click();

    // navigate to reservations
    await driver.sleep(sleep);
    const reservations = await driver.findElement(By.xpath("//*[@href='#/teetimes']"));
    await reservations.click();
  
    
    const datePicker = await driver.findElement(By.id("date-field"));
    await driver.executeScript("document.getElementById('date-field').value=''");
    datePicker.sendKeys(date, Key.ENTER);

    const test = await selectTimes(driver);
    console.log(test);


    await selectCourse(driver, '');

    console.log(2);




    // driver.close();
    // driver.quit();
})();



// returns true or false
// if there are no times => return false
// if there are times
//   check if within the hour, then select, return true
//   if not within the hour, return false
const selectTimes = async function(driver) {
    const times = await driver.findElement(By.id("times"));
    const noTimes = await until.elementTextContains(times, noTimesAvailable);
    if (noTimes) {
        return false;
    }

};

// changes the course drop down
const selectCourse = async function(driver, course) {
    const select = await driver.findElement(By.xpath("//option[contains(text(), 'Bethpage Blue Course')]"));
    await select.click();
};
