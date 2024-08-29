import { BASE_URL } from '../../support/variables';

// Custom Command to Wait for Angular to be Stable
Cypress.Commands.add('waitForAngular', () => {
    cy.window().then((win) => {
        return new Cypress.Promise((resolve) => {
            const angular = win.angular;
            if (!angular) {
                return resolve();
            }
            const injector = angular.element(document.body).injector();
            const $browser = injector.get('$browser');
            $browser.notifyWhenNoOutstandingRequests(resolve);
        });
    });
});

// Handle uncaught exceptions to prevent them from failing the test
Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

describe('Login Page Accessibility Tests - Focused on WAVE Errors', () => {

    it('should check for accessibility errors and contrast issues', () => {
        // Visit the login page URL
        cy.visit(`${BASE_URL}/account/login`);

        // Wait for Angular to be stable
        cy.waitForAngular();

        // Inject the Axe accessibility testing library into the page
        cy.injectAxe();

        // Define the specific rules to check
        const axeOptions = {
            rules: {
                'color-contrast': { enabled: true },  // Check for color contrast issues
                'landmark-one-main': { enabled: true },  // Ensures there's at least one main landmark
                'page-has-heading-one': { enabled: true },  // Ensures there's at least one h1 on the page
                'region': { enabled: true },  // Checks for landmark region roles
                // Add more specific rules here if needed
            }
        };

        // Run accessibility tests with the specified rules
        cy.checkA11y(null, axeOptions, (violations) => {
            cy.log(`${violations.length} accessibility violation${violations.length === 1 ? '' : 's'} detected`);

            // Log each violation with detailed information
            violations.forEach(({ id, impact, description, nodes }) => {
                cy.log(`ID: ${id}`);
                cy.log(`Impact: ${impact}`);
                cy.log(`Description: ${description}`);
                cy.log(`Number of Nodes: ${nodes.length}`);
                nodes.forEach((node) => {
                    cy.log(`HTML Element: ${node.html}`);
                    cy.log(`Failure Summary: ${node.failureSummary}`);
                });
            });

            // Optionally, log violations to the terminal using the 'log' task
            if (violations.length > 0) {
                cy.task('log', `Accessibility violations detected: ${violations.length}`);
                cy.task('log', violations); // Log violations to the terminal/console
            }
        }, {
            skipFailures: true  // This prevents cypress-axe from failing the test on violations
        });
    });
});
