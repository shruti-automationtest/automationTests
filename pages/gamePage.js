// /pages/gamePage.js
const selectors = require('../selectors/gameSelectors');
const { baseURL} = require('../playwright.config'); 
const {gameSelectors} = require('../selectors/gameSelectors');
const { compareImages } = require('../utils/ImageUtils');
const {sharp} = require('sharp'); // Add this import
const { resizeCanvasImage } = require('../utils/ImageUtils');  
const {fs} = require('fs');
const {path} = require('path');
class GamePage {
  constructor(page ) {
    this.page = page;
  }
  
  async clickCanvasButton(buttonTemplatePath, canvasScreenshotPath = 'temp/canvas_screenshot.png') {
    // Resize the canvas image to match the button's size
    await this.page.waitForTimeout(2000); 
    const buttonImage = await sharp(buttonTemplatePath).metadata();
    const resizedCanvasPath = 'temp/resized_canvas.png';
    await this.page.waitForTimeout(2000); 
    // Resize the canvas image
    await resizeCanvasImage(canvasScreenshotPath, resizedCanvasPath, buttonImage.width, buttonImage.height);

    // Compare the resized canvas image with the button template
    try {
      const matchData = await compareImages(resizedCanvasPath, buttonTemplatePath);
      console.log('Button found!', matchData);

      // If a match is found, calculate the coordinates to click
      const buttonCoords = this.getButtonCoordinates(matchData);

      // Click at the location of the menu button (canvas)
      await this.page.mouse.click(buttonCoords.x, buttonCoords.y);
    } catch (error) {
      console.error('Error during image matching:', error);
    }
  }

  // Get the button's coordinates from the match data
  getButtonCoordinates(matchData) {
    // Assuming that matchData contains bounding box coordinates
    return {
      x: matchData.boundingBox.x + 10, // Adjust based on the match data
      y: matchData.boundingBox.y + 10, // Adjust based on the match data
    };
  }
  async openWebsite() {
    await this.page.goto('/');
  }
   async handleCookieConsent() {
    try {
      const acceptButton = this.page.locator(selectors.acceptCookiesButton);
      if (await acceptButton.isVisible({ timeout: 3000 })) {
        await acceptButton.click();
        console.log("Cookie consent accepted");
      }
    } catch (err) {
      console.log("Cookie popup not found or already handled");
    }
  }
  async handleAgeVerification() {
    try {
      const ageYesButton = this.page.locator(selectors.ageVerificationYesButton);
      if (await ageYesButton.isVisible({ timeout: 3000 })) {
        await ageYesButton.click();
        console.log('✅ Age verification passed');
      }
    } catch (err) {
      console.log('⚠️ Age popup not found or already handled');
    }
  }
  async clickGames() {
    await this.page.locator(selectors.gameDropDown).click();
  }
  async clickCanyonRiches() {
    await this.page.locator(selectors.canyonRichesGame).scrollIntoViewIfNeeded();

    await this.page.locator(selectors.canyonRichesGame).click();  
  }
  async clickTryDemo() {
    await this.page.locator(selectors.tryDemoButton).waitFor({ state: 'visible' });
    await this.page.locator(selectors.tryDemoButton).click();
    await this.handleCookieConsent();
    await this.page.waitForLoadState('load');
    await this.page.waitForTimeout(10000);
  }

  async switchToIframeAndClickSecondCanvas() {
    try {
      await this.handleCookieConsent();
    } catch (error) {
      console.warn("Cookie consent not present or already handled:", error.message);
    }
    const viewport = this.page.viewportSize();
    if (!viewport) {
      throw new Error("Viewport size not available");
    }
    const centerX = viewport.width / 2;
    const centerY = viewport.height / 2;
    await this.page.mouse.click(centerX, centerY);
    await this.handleCookieConsent();
    await this.page.waitForTimeout(10000);
    }
    
  async openGameInfo() {
    await this.page.waitForSelector(selectors.gameInfoButton, { state: 'visible', timeout: 10000 }); 
    await this.page.locator(selectors.gameInfoButton).click();
    await this.page.waitForTimeout(4000);
  }

  async openGameRules() {
    await this.page.click(selectors.gameRulesButton);
    await this.page.waitForTimeout(4000);
  }

  async closeGameInfo() {
    await this.page.click(selectors.closeGameInfoButton);
    await this.page.waitForTimeout(1000);
  }

  async closeGameRules() {

    await this.page.click(selectors.closeGameRulesButton);
    await this.page.waitForTimeout(1000);
  }

  async closeSettings() {
    await this.page.click(selectors.closeSettingsButton);
    await this.page.waitForTimeout(1000);
  }

  async scrollToBottom() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await this.page.waitForTimeout(3000);
  }

  async captureScreenshot(stepName) {
    const screenshotPath = `./screenshots/${stepName}.png`;
    await this.page.screenshot({ path: screenshotPath });
    console.log(`Screenshot captured: ${screenshotPath}`);
  }
}

module.exports = { GamePage };
