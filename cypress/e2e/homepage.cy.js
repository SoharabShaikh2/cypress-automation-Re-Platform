describe('QA Environment Test', () => {
    it('should load the homepage', () => {
      cy.visit('/');
      cy.contains('Funder Portal Re-Platform QA'); // Adjust this to match your app's homepage content
    });
  });
  