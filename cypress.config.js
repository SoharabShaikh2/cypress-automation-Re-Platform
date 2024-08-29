// const { defineConfig } = require("cypress");

// module.exports = defineConfig({
//   e2e: {
//     baseUrl: 'https://gv-replatform.azurewebsites.net/', // Replace with your actual QA URL
//   },
// });


// cypress.config.js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Register a 'log' task that will print messages to the console
      on('task', {
        log(message) {
          console.log(message);
          return null;
        }
      });

      // You can add more tasks or other event listeners here

      return config;
    },

    // Your other Cypress configuration options...
  },
});
