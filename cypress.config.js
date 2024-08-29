const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://gv-replatform.azurewebsites.net/', // Replace with your actual QA URL
  },
});
