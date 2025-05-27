// Verify that the user login successfully and the toast notification is displayed
const { Builder, By, Key, until } = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const assert = require('assert')

describe('login', function() {
  this.timeout(30000)
  let driver
  let vars
  beforeEach(async function() {
    const options = new chrome.Options()
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build()
    vars = {}
  })
  afterEach(async function() {
    if (driver) {
      await driver.quit()
    }
  })
  it('login', async function() {
    await driver.get("https://admin.stage.vcc.hebronsoft.com/auth/login")
    await driver.manage().window().setRect({ width: 1440, height: 900 })
    await driver.findElement(By.id("login-email")).click()
    await driver.findElement(By.id("login-email")).sendKeys("qwe@qwe.com")
    await driver.findElement(By.id("login-pass")).click()
    await driver.findElement(By.id("login-pass")).sendKeys("qweQWE123")
    await driver.findElement(By.id("log-btn")).click()
    
    // Wait for toast notification to appear and verify its text
    try {
      const toastElement = await driver.wait(
        until.elementLocated(By.xpath("//div[contains(@class, 'toast')]")),
        10000
      )
      const toastText = await toastElement.getText()
      // Check if the text contains "Hi Super!" anywhere in the string
      assert.ok(toastText.includes("Hi Super!"), 'Toast notification should contain "Hi Super!"')
    } catch (error) {
      console.error('Toast notification verification failed:', error)
      throw error
    }
  })
})