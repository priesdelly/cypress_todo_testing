describe('Todo', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000/')
  })

  it('Click add button', () => {
    const btn = cy.get('[data-testid="btn-add"]');
    btn.click();
    cy.location('href').should('include', '/todo/add');
  })

  it('Fill title form', () => {
    const title = cy.get('#input-title');
    title.type("Test");
    title.should("have.value", "Test");
  })

  it('Fill note form', () => {
    const note = cy.get('#input-note');
    note.type("Test note");
    note.should("have.value", "Test note");
  });

  it('Fill due date form', () => {
    const dueDate = cy.get('#input-due-date');
    dueDate.type('2022-11-10');
    dueDate.should("have.value", "2022-11-10");
  });

  it('Fill priority form', () => {
    const priority = cy.get('#input-priority');
    priority.select('high');
    priority.should("have.value", "high");
  });

  it('Submit form', () => {
    cy.intercept('POST', 'http://localhost:3000/api/todo').as('submitForm');
    cy.get('[data-cy="submit"]').click();
    cy.wait('@submitForm')
  });
})