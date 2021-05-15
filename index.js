
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

(async function myFunction() {
    // headless
    let driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new chrome.Options().headless().windowSize(screen))
      .build();

    // not headless
    // let driver = await new Builder()
    //   .forBrowser('chrome')
    //   .build();


    await driver.get('https://foreupsoftware.com/index.php/booking/19765/2431#teetimes');
    const bookingClasses = await driver.findElement(By.className("booking-classes"));
    const resident = await bookingClasses.findElement(By.className("btn-primary"));
    await resident.click();


    const login = await driver.findElement(By.className("login"));
    await login.click();
    await driver.wait(until.elementLocated(By.id("login"), 100));


    const email = await driver.findElement(By.id("login_email"));
    const password = await driver.findElement(By.id("login_password"));

    email.sendKeys("ckeisato@gmail.com");
    password.sendKeys("golfgolf");

    const modal = await driver.findElement(By.id("login"));
    const loginButton = await modal.findElement(By.className("login"));


    console.log(1);
    await driver.sleep(600);


    await loginButton.click();

    console.log(2);




    // driver.close();
    // driver.quit();
})();
