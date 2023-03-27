describe('client-feature-register', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=featureregistercomponent--primary')
  );
  it('should render the component', () => {
    cy.get('full-stack-todo-feature-register').should('exist');
  });
});
