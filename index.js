
const {
  Builder,
  By,
  until
} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const screen = {
  width: 1440,
  height: 900
};

const sleep = 700;
const date = "05-22-2021";

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
    const bookingClasses = await driver.findElement(By.className("booking-classes"));
    const resident = await bookingClasses.findElement(By.className("btn-primary"));
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
    console.log(0);
    await loginButton.click();

    // navigate to reservations
    await driver.sleep(sleep);
    const reservations = await driver.findElement(By.xpath("//*[@href='#/teetimes']"));
    await reservations.click();
  
    // await driver.wait(until.elementLocated(By.id("date-field"), 100));
    // const datePicker = await driver.findElement(By.id("date-field"));

    // // await datePicker.clear();  
    // datePicker.sendKeys("value", date);

    const temp = await driver.findElement(By.xpath("//td[contains(text(),'22')] "));
    console.log(temp);
    temp.click();


    console.log(2);




    // driver.close();
    // driver.quit();
})();
