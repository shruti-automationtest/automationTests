function getSystemLanguage() {
    return process.env.LANGUAGE || 'en-US';
  }
  module.exports = { getSystemLanguage };