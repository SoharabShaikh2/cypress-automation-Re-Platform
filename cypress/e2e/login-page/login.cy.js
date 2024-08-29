import { BASE_URL } from '../../support/variables';

// Element Selectors
export const login_Input_U = 'input[id="login_userNameOrEmailAddress"]';
export const login_Input_P = 'input[id="login_password"]';
export const login_checkbox = 'input[name="rememberMe"]';
export const login_forgot = 'a[id="forget-password"]';
export const login_userName = 'admin';
export const login_pass = '!qazxsw23edcvfr4ADMIN';

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

describe('Login Page Tests', () => {

    beforeEach(() => {
        // Intercept the API call to get login information
        cy.intercept('/api/services/app/Session/GetCurrentLoginInformations').as('getLoginInfo');

        // Visit the login page URL
        cy.visit(`${BASE_URL}/account/login`);
        

        // Wait for the login information API call to complete
        cy.wait('@getLoginInfo');

        // Wait for Angular to be stable
        cy.waitForAngular();

        // Ensure that the username and password fields are visible before proceeding
        cy.get(login_Input_U, { timeout: 10000 }).should('be.visible');
        cy.get(login_Input_P, { timeout: 10000 }).should('be.visible');
    });

    it('should display the login page correctly', () => {
        // Check if the 'Log In' button is visible
        cy.get('button').contains('Log In ').should('be.visible');

        // Check if the 'Register' button is visible
        cy.get('button').contains('Register ').should('be.visible');

        // Check if the 'Remember me' checkbox is visible
        cy.get(login_checkbox).should('be.visible');
    });

    it('should not allow wrong user id and password to log in', () => {
        // Intercept the API call that checks the credentials
        cy.intercept('POST', '**/api/TokenAuth/Authenticate').as('loginRequest');

        // Enter the incorrect username and password
        cy.get(login_Input_U).type('wrong' + login_userName);
        cy.get(login_Input_P).type(login_pass + 'wrong');

        // Click on the 'Remember me' checkbox
        cy.get(login_checkbox).check();

        // Click on the 'Log In' button
        cy.get('button').contains('Log In ').click();

        // Wait for the login API request to finish and check the status
        cy.wait('@loginRequest', { timeout: 10000 }).its('response.statusCode').should('eq', 401);

        // Now check for the modal with the error message
        cy.get('.swal2-html-container').contains('Invalid User Name Or Password').should('be.visible');

        // Optionally, click the "Ok" button to close the modal
        cy.get('.swal2-confirm').click();
    });
    

    it('should allow a user to log in', () => {

        // Intercept the API call that checks the credentials
        cy.intercept('POST', '**/api/TokenAuth/Authenticate').as('loginRequest');

        // Enter the correct username and password
        cy.get(login_Input_U).type(login_userName);
        cy.get(login_Input_P).type(login_pass);

        // Click on the 'Remember me' checkbox
        cy.get(login_checkbox).check();

        // Click on the 'Log In' button
        cy.get('button').contains('Log In ').click();

        cy.wait('@loginRequest');

        // Add assertions for post-login behavior, such as checking for redirects or specific dashboard elements
        cy.url().should('include', '/dashboard');  // Replace with the actual post-login URL
        cy.get('h1').contains(' Dashboard ');  // Replace with actual dashboard element selector
    });
});

