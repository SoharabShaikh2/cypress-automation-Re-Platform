import { BASE_URL,API_URL } from '../../support/variables';
//import { login_pass } from '../login-page/login.cy';

// Element Selectors


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

describe('Register Page Loading Tests', () => {

    beforeEach(() => {
        // Intercept the API call to get login information
        //cy.intercept(`${API_URL}/api/services/app/SignupFormSetups/GetAllForMandatoryCheck`).as('getFullAPI');

        // Visit the login page URL
        cy.visit(`${BASE_URL}/account/register`);
        

        // Wait for the login information API call to complete
        //cy.wait('@getFullAPI' ,{ timeout: 10000 });

        // Wait for Angular to be stable
        cy.waitForAngular();

        // Ensure that the username and password fields are visible before proceeding
        cy.get('span', { timeout: 10000 }).contains('Applicant Registration Question').should('be.visible');
        //cy.get(login_Input_P, { timeout: 10000 }).should('be.visible');
    });

    it('should question visible in the register page correctly', () => {
        cy.get('span' ).contains('Applicant Registration Question' ).should('be.visible' );
        cy.get('.form-group.m-form__group.row').eq(0).find('button').contains('No').click();
        cy.get('.form-group.m-form__group.row').eq(1).find('button').contains('Yes').click();
        cy.get('button.btn-primary', { timeout: 10000 }).then(($button) => {
            // Check if the button is not disabled
            if (!$button.is(':disabled')) {
              // Click the button if it's not disabled
              cy.wrap($button).click();
            } else {
              // Log or handle if the button is disabled
              cy.log('Primary button is disabled, skipping click action.');
            }
          });
    });
});


