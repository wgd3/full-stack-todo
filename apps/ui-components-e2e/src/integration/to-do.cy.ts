describe('To-Do Component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=todocomponent--primary'));
  it('should render the component', () => {
    cy.get('fst-todo').should('exist');
  });

  it('should detect clicks on the delete button', () => {
    cy.storyAction('click');
    cy.get('.btn--danger').click();
    cy.get('@click').should('have.been.calledOnce');
  });

  it('should detect clicks on the complete button', () => {
    cy.storyAction('click');
    cy.get('.todo__completed').click();
    cy.get('@click').should('have.been.calledOnce');
  });

  it('should be able to edit the title', () => {
    cy.storyAction('dblclick');
    cy.get('.todo__title').dblclick();
    cy.get('@dblclick').should('have.been.calledOnce');
    cy.get('.form-control.h4').should('exist');
  });
});
