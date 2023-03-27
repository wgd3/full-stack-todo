describe('client-feature-register', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=featureregistercomponent--primary')
  );
  xit('should render the component', () => {
    cy.get('full-stack-todo-feature-register').should('exist');
  });
});
