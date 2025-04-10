const { test, expect } = require('@playwright/test');
const { GamePage } = require('../pages/gamePage');
const path = require('path');
const { compareImages } = require('../utils/ImageUtils'); // Import compareImages
const { chromium } = require('@playwright/test');
const { resizeCanvasImage } = require('../utils/ImageUtils');  
test.describe('Game UI Navigation and Verification', () => {
  //let page;
  let gamePage;

  test.beforeAll(async () => {
    const browser = await chromium.launch({
      headless: false,
      args: [
        '--lang=fr-FR',
        '--disable-features=TranslateUI',
        '--disable-translate',
        '--no-sandbox'
      ]
  });
  const context = await browser.newContext({
    locale: 'fr-FR',                      // Sets Accept-Language header
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });
   const page = await context.newPage();
  gamePage = new GamePage(page); // Instantiate the page object
    });
  test('should navigate through the game UI and verify text', async () => {
    await gamePage.openWebsite();
    const navigatorLang = await gamePage.page.evaluate(() => navigator.language);
console.log('navigator.language =', navigatorLang);
if (navigatorLang !== 'fr-FR') throw new Error('Language is NOT set to fr-FR');

// ✅ Assert navigator.languages includes 'fr-FR'
const navigatorLanguages = await gamePage.page.evaluate(() => navigator.languages);
console.log('navigator.languages =', navigatorLanguages);
if (!navigatorLanguages.includes('fr-FR')) throw new Error('fr-FR not in navigator.languages');
    await gamePage.captureScreenshot('homepage');
    await gamePage.handleCookieConsent();
    await gamePage.handleAgeVerification();
    await gamePage.captureScreenshot('agecookieshandled');
    await gamePage.clickGames();
    await gamePage.captureScreenshot('clickonscrolldown')
    await gamePage.clickCanyonRiches();
    await gamePage.captureScreenshot('game_selected')
    await gamePage.clickTryDemo();
    await gamePage.switchToIframeAndClickSecondCanvas();
    await gamePage.captureScreenshot('canyon_riches_clicked');
    const buttonTemplatePath = path.join(__dirname, '../screenshots/menubutton.png');
    const canvasScreenshotPath = path.join(__dirname, '../screenshots/canvas.png');
    const resizedCanvasPath = path.join(__dirname, '../temp/resized_canvas.png');
    const resizedButtonPath = path.join(__dirname, '../temp/resized_menubutton.png');

    // Resize the images before comparing
    await resizeCanvasImage(buttonTemplatePath, resizedButtonPath, 500, 500);
    await resizeCanvasImage(canvasScreenshotPath, resizedCanvasPath, 500, 500);

    // Now compare the resized images
    const comparisonResult = await compareImages(resizedButtonPath, resizedCanvasPath);
    if (comparisonResult.match) {
      console.log('Images match!');
    } else {
      console.log('Images do not match!');
    }

    //await this.page.pause();
    await gamePage.openGameInfo();
    await gamePage.captureScreenshot('game_info_opened');
    await gamePage.scrollToBottom();
    await gamePage.captureScreenshot('game_info_scrolled');
    await gamePage.closeGameInfo();
    await gamePage.captureScreenshot('game_info_closed');
    await gamePage.clickSettings();
    await gamePage.openGameRules();
    await gamePage.captureScreenshot('game_rules_opened');
    await gamePage.scrollToBottom();
    await gamePage.captureScreenshot('game_rules_scrolled');
    await gamePage.closeGameRules();
    await gamePage.captureScreenshot('game_rules_closed');
    await gamePage.closeSettings();
    await gamePage.captureScreenshot('settings_closed');
  });

  test.afterAll(async () => {
    // Optionally close the browser
    // await page.context().browser().close();
  });
});
