import { BASE_URL, API_URL } from '../../support/variables';

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
        cy.log('Intercepting API call');
        //cy.intercept('GET', `${API_URL}/api/services/app/Session/GetCurrentLoginInformations`).as('getFullAPI');

        // Visit the login page URL
        cy.log('Visiting the register page');
        cy.visit(`${BASE_URL}/account/register`);

        // Wait for the login information API call to complete
        cy.log('Waiting for API call to complete');
        // cy.wait('@getFullAPI').then((interception) => {
        //     cy.log('API call completed:', interception);
        // });

        // Wait for Angular to be stable
        cy.waitForAngular();

        // Ensure that the 'Applicant Registration Question' is visible before proceeding
        //cy.get('span', { timeout: 10000 }).contains('Applicant Registration Question').should('be.visible');
    });

    // it('should question visible in the register page correctly', () => {
    //     cy.get('span').contains('Applicant Registration Question').should('be.visible');
    // });

    it('should fill out and submit the registration form', () => {
        // Fill out the registration form fields

        // Organization field
        cy.get('input[name="OrganizationName"]').type('Test 2024 Organization3');

        // Org. Type dropdown
        cy.get('p-dropdown[name="OrganizationType"]').click(); // Click to open the dropdown
        cy.get('li').contains('Community Based Organization, non-501(c)(3)').click(); // Select the specific option


        // First Name
        cy.get('input[name="Name"]').type('John');

        // Last Name
        cy.get('input[name="Surname"]').type('Doe');

        // Email Address
        cy.get('input[name="EmailAddress"]').type('3john.doe@example.com');

        // User Name
        cy.get('input[name="UserName"]').type('3john_doe');

        // Password
        cy.get('input[name="Password"]').type('Zaq12wsxcde#');

        // Password (repeat)
        cy.get('input[name="PasswordRepeat"]').type('Zaq12wsxcde#');

        // Submit the form
        cy.get('button[type="submit"]').contains('Submit').click();

        // Optionally, verify if the form was submitted successfully
        //cy.get('div').contains('Registration Successful').should('be.visible'); // Adjust based on the success message or page behavior
    });

    // it('should show error messages for required fields if left empty', () => {
    //     // Leave all required fields empty and submit
    //     cy.get('button[type="submit"]').contains('Submit').click();

    //     // Verify that the 'This field is required' message appears
    //     cy.get('span').contains('This field is required').should('be.visible');
    // });

});
