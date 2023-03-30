describe('To-Do Component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=todocomponent--with-content'));
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

describe('TodoComponent Without Content', () => {
  beforeEach(() => cy.visit('/iframe.html?id=todocomponent--no-input'));
  it('should show an input and textarea element', () => {
    cy.get('#input-form-control-empty').should('exist');
    cy.get('#textarea-form-control-empty').should('exist');
  });

  it('should have a delete button', () => {
    cy.get('#btn-delete').should('exist');
  });

  it('should have a save button', () => {
    cy.get('#btn-save').should('exist');
  });

  it('should emit data on save', () => {
    cy.storyAction('click');
    cy.get('#btn-save').click();
    cy.get('@click').should('have.been.called');
  });
});
