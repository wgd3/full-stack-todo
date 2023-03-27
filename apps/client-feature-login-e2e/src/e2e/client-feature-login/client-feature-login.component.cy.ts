describe('client-feature-login', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=clientfeaturelogincomponent--primary')
  );
  xit('should render the component', () => {
    cy.get('full-stack-todo-client-feature-login').should('exist');
  });
});
