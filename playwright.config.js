module.exports = {
    use: {
      baseURL: 'https://www.avatarux.com',
      browserName: 'chromium',
      headless: false, // Set to true if you want to run in headless mode
      viewport: { width: 1280, height: 720 },
      
    },
    testDir: 'tests',
  };
  