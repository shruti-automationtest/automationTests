function getSystemLanguage() {
    return process.env.LANGUAGE || 'en-US';  // Default to 'en-US' if not set
  }
  
  module.exports = { getSystemLanguage };