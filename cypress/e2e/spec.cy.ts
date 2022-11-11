import { format } from "date-fns";
import { ITodo } from "../../interfaces/todo.interface";

context('Test todo valid', () => {
  let data: ITodo | null = null;

  describe('Add success', () => {
    it('Visit site', () => {
      cy.visit('http://localhost:3000/');
    })

    it('Click add button', () => {
      const btn = cy.get('[data-testid="btn-add"]');
      btn.click();
      cy.location('href').should('include', '/todo/add');
    })

    it('Fill title form', () => {
      cy.get('#input-title')
        .type("Study Software Testing")
        .should("have.value", "Study Software Testing");
    })

    it('Fill due date form', () => {
      cy.get('#input-due-date')
        .type(format(new Date(), 'yyyy-MM-dd'))
        .should("have.value", format(new Date(), 'yyyy-MM-dd'));
    });

    it('Fill priority form', () => {
      cy.get('#input-priority')
        .select('high')
        .should("have.value", "high");
    });

    it('Submit form', () => {
      cy.intercept('POST', 'http://localhost:3000/api/todo').as('submitForm');
      cy.get('[data-cy="submit"]').click();
      cy.wait('@submitForm').then((interception) => {
        expect(interception.response?.statusCode).eq(201);
        assert.isNotNull(interception.response?.body, 'Save data success');
        const body = interception.response?.body;
        if (body) {
          data = body;
        }
      })
    });

    it('Data should exist', () => {
      const tr = cy.get(`[data-testid="tr-${data?.id}"]`);
      tr.should('exist');
    })
  })

  describe('Edit success', () => {
    it('Visit site', () => {
      cy.visit('http://localhost:3000/');
    })

    it('Click edit button', () => {
      const btn = cy.get(`[data-testid="btn-edit-${data?.id}"]`);
      btn.click();
      cy.location('href').should('include', '/todo/' + data?.id);
    })

    it('Check title form', () => {
      cy.get('#input-title')
        .should("have.value", "Study Software Testing");
    })

    it('Change note form', () => {
      cy.get('#input-note')
        .should("have.value", "");
    });

    it('Check due date form', () => {
      cy.get('#input-due-date')
        .should("have.value", format(new Date(data!.dueDate), 'yyyy-MM-dd'));
    });

    it('Change title form', () => {
      cy.get('#input-title')
        .clear()
        .type("Study Software Testing and Quality Assurance")
        .should("have.value", "Study Software Testing and Quality Assurance");
    })

    it('Change note form', () => {
      cy.get('#input-note')
        .clear()
        .type("Study complete")
        .should("have.value", "Study complete");
    });

    it('Change priority form', () => {
      cy.get('#input-priority')
        .select('medium')
        .should("have.value", "medium");
    });

    it('Change finished form', () => {
      cy.get('#input-isFinished')
        .check()
        .should("be.checked");
    });

    it('Submit form', () => {
      cy.intercept('PUT', 'http://localhost:3000/api/todo/' + data?.id).as('submitForm');
      cy.get('[data-cy="submit"]').click();
      cy.wait('@submitForm').then((interception) => {
        expect(interception.response?.statusCode).eq(200);
      })
    });

    it('Data should exist', () => {
      cy.get(`[data-testid="tr-${data?.id}"]`).should('exist');
    })
  })

  describe('Delete', () => {
    it('Visit site', () => {
      cy.visit('http://localhost:3000/');
    })

    it('Click delete button', () => {
      cy.intercept('DELETE', 'http://localhost:3000/api/todo/' + data?.id).as('delete');
      cy.get(`[data-testid="btn-delete-${data?.id}"]`).click();
      cy.wait('@delete').then((interception) => {
        expect(interception.response?.statusCode).eq(200);
      })
    })

    it('Data should not exist', () => {
      const tr = cy.get(`[data-testid="tr-${data?.id}"]`);
      tr.should('not.exist');
    })
  })
})

context('Test todo invalid', () => {
  describe('Invlid form', () => {

    const clear = () => {
      cy.get('#input-title').clear();
      cy.get('#input-note').clear();
      cy.get('#input-due-date').clear();
    }

    const submit = () => {
      cy.intercept('POST', 'http://localhost:3000/api/todo').as('submitForm');
      cy.get('[data-cy="submit"]').click();
      cy.wait('@submitForm').then((interception) => {
        expect(interception.response?.statusCode).eq(400);
      })
    }

    it('Visit site', () => {
      cy.visit('http://localhost:3000/todo/add');
    })

    it('Title is empty', () => {
      clear();
      cy.get('#input-note').type('test note');
      cy.get('#input-due-date').type(format(new Date(), 'yyyy-MM-dd'));
      submit();
    })

    it('Should have invalid title', () => {
      cy.get('[data-testid="invalid-label"]').contains('span', 'Title is required.');
    })

    it('Due date is empty', () => {
      clear();
      cy.get('#input-title').type('test note');
      cy.get('#input-note').type('test note');
      submit();
    })

    it('Should have invalid due date', () => {
      cy.get('[data-testid="invalid-label"]').contains('span', 'Due date is required.');
    })

    it('Due date before today', () => {
      clear();
      cy.get('#input-title').type('test note');
      const today = new Date();
      today.setDate(today.getDate() - 1);
      cy.get('#input-due-date').type(format(today, 'yyyy-MM-dd'));
      cy.get('#input-note').type('test note');
      submit();
    })

    it('Should have invalid due date', () => {
      cy.get('[data-testid="invalid-label"]').contains('span', 'Due date must be after today.');
    })

    it('Title over 50 character', () => {
      clear();
      cy.get('#input-title').type('Lorem ipsum dolor sit amet, consectetuer adipiscing');
      cy.get('#input-due-date').type(format(new Date(), 'yyyy-MM-dd'));
      submit();
    })

    it('Should have invalid title', () => {
      cy.get('[data-testid="invalid-label"]').contains('span', 'Length of title must less than 50 character.');
    })

    it('Note over 144 character', () => {
      clear();
      cy.get('#input-note').type('Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis.');
      cy.get('#input-due-date').type(format(new Date(), 'yyyy-MM-dd'));
      submit();
    })

    it('Should have invalid note', () => {
      cy.get('[data-testid="invalid-label"]').contains('span', 'Length of note must less than 144 character.');
    })

    it('Should have invalid title and due date', () => {
      clear();
      submit();
      cy.get('[data-testid="invalid-label"]').contains('span', 'Title is required.');
      cy.get('[data-testid="invalid-label"]').contains('span', 'Due date is required.');
    })

  })

})