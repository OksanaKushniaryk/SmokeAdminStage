const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')

describe('createOrgCategory', function() {
  this.timeout(30000)
  let driver
  let vars
  beforeEach(async function() {
    driver = await new Builder().forBrowser('chrome').build()
    vars = {}
  })
  afterEach(async function() {
    await driver.quit();
  })
  it('createOrgCategory', async function() {
    // Navigate to login page
    await driver.get("https://admin.stage.vcc.hebronsoft.com/auth/login")
    await driver.manage().window().setRect({ width: 1400, height: 900 })
    
    // Wait for and fill login form
    await driver.wait(until.elementLocated(By.id("login-email")), 10000, "Login email field not found")
    await driver.findElement(By.id("login-email")).sendKeys("qwe@qwe.com")
    await driver.findElement(By.id("login-pass")).sendKeys("qweQWE123")
    await driver.findElement(By.id("log-btn")).click()
    
    // Wait for navigation and click on My Organization
    await driver.wait(until.elementLocated(By.id("organization-btn")), 10000, "My Organization button not found")
    const myOrgButton = await driver.findElement(By.id("organization-btn"))
    await myOrgButton.click()
    
    // Wait for and click on Org Categories in the dropdown
    const orgCategoriesOption = await driver.wait(
      until.elementLocated(By.xpath("//div[contains(@class, 'item-title') and text()='Org Categories']")),
      10000,
      "Org Categories option not found"
    )
    await orgCategoriesOption.click()
    
    // Wait for and click Create Org Category button
    const createOrgTypeButton = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(.,'Create New Organization Category')]")),
      10000,
      "Create New Organization Category button not found"
    )
    await createOrgTypeButton.click()
    
    // Wait for any dialog to appear (using a more generic selector)
    const dialog = await driver.wait(
      until.elementLocated(By.css("mat-dialog-container")),
      10000,
      "No dialog found"
    )
    
    // Log the dialog's ID to help debug
    const dialogId = await dialog.getAttribute('id')
    console.log('Found dialog with ID:', dialogId)
    
    // Wait for dialog to be visible
    await driver.wait(until.elementIsVisible(dialog), 10000, "Dialog not visible")
    
    // Find and fill the Organization Category input using the found dialog
    const orgCategoryInput = await driver.wait(
      until.elementLocated(By.css(`mat-dialog-container#${dialogId} input[formcontrolname='name']`)),
      10000,
      "Org category input not found"
    )
    await orgCategoryInput.sendKeys("Test")
    
    // Submit form using the found dialog
    const submitButton = await driver.wait(
      until.elementLocated(By.css(`mat-dialog-container#${dialogId} button[type='submit']`)),
      10000,
      "Submit button not found"
    )
    await submitButton.click()
    
    // Wait for success toast
    await driver.wait(
      until.elementLocated(By.css("#toast-container div")),
      10000,
      "Success toast not found"
    )
    
    // Wait for table to be present
    await driver.wait(
      until.elementLocated(By.css("p-table")),
      10000,
      "Table not found"
    )
    
    // Wait for the new Org Category to appear in the table
    const orgCategoryCell = await driver.wait(
      until.elementLocated(By.xpath("//div[contains(@class, 'body-1') and text()=' Test ']")),
      10000,
      "New Org Category not found in table"
    )
    
    // Assert that the row exists
    assert.ok(orgCategoryCell, "Row with new Org Category should exist")
  })
})