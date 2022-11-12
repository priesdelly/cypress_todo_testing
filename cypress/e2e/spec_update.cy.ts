import { format } from 'date-fns';
import fixture from '../fixtures/data.json';
import { ITodo } from '../../interfaces/todo.interface';

context('Test edit todo', () => {
  let data: ITodo;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date();
  yesterday.setHours(0, 0, 0, 0);
  yesterday.setDate(today.getDate() - 1);

  const tomorrow = new Date();
  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(today.getDate() + 1);

  const after2_5Year = new Date();
  after2_5Year.setHours(0, 0, 0, 0);
  after2_5Year.setFullYear(after2_5Year.getFullYear() + 2.5);

  const after5Year = new Date();
  after5Year.setHours(0, 0, 0, 0);
  after5Year.setFullYear(after5Year.getFullYear() + 5);

  const after5YearMinus1Day = new Date();
  after5YearMinus1Day.setHours(0, 0, 0, 0);
  after5YearMinus1Day.setFullYear(after5YearMinus1Day.getFullYear() + 5);
  after5YearMinus1Day.setDate(after5YearMinus1Day.getDate() - 1);

  const after5YearPlus1Day = new Date();
  after5YearPlus1Day.setHours(0, 0, 0, 0);
  after5YearPlus1Day.setFullYear(after5YearPlus1Day.getFullYear() + 5);
  after5YearPlus1Day.setDate(after5YearPlus1Day.getDate() + 1);

  const goEdit = () => {
    const btn = cy.get(`[data-testid="btn-edit-${data.id}"]`);
    btn.click();
    cy.location('href').should('include', `/todo/${data.id}`);
  };

  const submitSuccess = () => {
    cy.intercept('PUT', `http://localhost:3000/api/todo/${data.id}`).as(
      'submitForm'
    );
    cy.get('[data-cy="submit"]').click();
    cy.wait('@submitForm').then((interception) => {
      expect(interception.response?.statusCode).eq(200);
    });
  };

  const submitFail = () => {
    cy.intercept('PUT', `http://localhost:3000/api/todo/${data.id}`).as(
      'submitForm'
    );
    cy.get('[data-cy="submit"]').click();
    cy.wait('@submitForm').then((interception) => {
      expect(interception.response?.statusCode).eq(400);
    });
  };

  describe('Prepare data', () => {
    it('Visit site', () => {
      cy.visit('http://localhost:3000/');
    });

    it('Click add button', () => {
      const btn = cy.get('[data-testid="btn-add"]');
      btn.click();
      cy.location('href').should('include', '/todo/add');
    });

    it('Fill title form', () => {
      cy.get('#input-title')
        .type('Study Software Testing')
        .should('have.value', 'Study Software Testing');
    });

    it('Fill due date form', () => {
      cy.get('#input-due-date')
        .type(format(new Date(), 'yyyy-MM-dd'))
        .should('have.value', format(new Date(), 'yyyy-MM-dd'));
    });

    it('Fill priority form', () => {
      cy.get('#input-priority').select('high').should('have.value', 'high');
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
      });
    });
  });

  describe('Invalid title', () => {
    it('Visit to do list', () => {
      cy.visit('http://localhost:3000/');
    });

    it('Title add empty', () => {
      goEdit();
      cy.get('#input-title').clear();
      submitFail();
      cy.get('[data-testid="invalid-label"]')
        .contains('span', 'Title is required.')
        .should('exist');
    });

    it('Title add 51 character', () => {
      cy.get('#input-title').type(fixture.character_51);
      submitFail();
      cy.get('[data-testid="invalid-label"]')
        .contains('span', 'Title is required.')
        .should('not.exist');
      cy.get('[data-testid="invalid-label"]')
        .contains('span', 'Length of title must less than 50 character.')
        .should('exist');
    });
  });

  describe('Valid title', () => {
    it('Back to to do list', () => {
      cy.visit('http://localhost:3000/');
    });

    it('Title add 1 character', () => {
      goEdit();
      cy.get('#input-title').clear();
      cy.get('#input-title').type(fixture.character_1);
      submitSuccess();
    });

    it('Title add 2 character', () => {
      goEdit();
      cy.get('#input-title').clear();
      cy.get('#input-title').type(fixture.character_2);
      submitSuccess();
    });

    it('Title add 25 character', () => {
      goEdit();
      cy.get('#input-title').clear();
      cy.get('#input-title').type(fixture.character_25);
      submitSuccess();
    });

    it('Title add 49 character', () => {
      goEdit();
      cy.get('#input-title').clear();
      cy.get('#input-title').type(fixture.character_49);
      submitSuccess();
    });

    it('Title add 50 character', () => {
      goEdit();
      cy.get('#input-title').clear();
      cy.get('#input-title').type(fixture.character_50);
      submitSuccess();
    });
  });

  describe('Invalid note', () => {
    it('Visit to do list', () => {
      cy.visit('http://localhost:3000/');
    });

    it('Note add 145 character', () => {
      goEdit();
      cy.get('#input-note').type(fixture.character_145);
      submitFail();
      cy.get('[data-testid="invalid-label"]')
        .contains('span', 'Length of note must less than 144 character.')
        .should('exist');
    });
  });

  describe('Valid note', () => {
    it('Visit to do list', () => {
      cy.visit('http://localhost:3000/');
    });

    it('Note add 1 character', () => {
      goEdit();
      cy.get('#input-note').clear();
      cy.get('#input-note').type(fixture.character_1);
      submitSuccess();
    });

    it('Note add 2 character', () => {
      goEdit();
      cy.get('#input-note').clear();
      cy.get('#input-note').type(fixture.character_2);
      submitSuccess();
    });

    it('Note add 72 character', () => {
      goEdit();
      cy.get('#input-note').clear();
      cy.get('#input-note').type(fixture.character_72);
      submitSuccess();
    });

    it('Note add 143 character', () => {
      goEdit();
      cy.get('#input-note').clear();
      cy.get('#input-note').type(fixture.character_143);
      submitSuccess();
    });

    it('Note add 144 character', () => {
      goEdit();
      cy.get('#input-note').clear();
      cy.get('#input-note').type(fixture.character_144);
      submitSuccess();
    });
  });

  describe('Invalid due date', () => {
    it('Visit to do list', () => {
      cy.visit('http://localhost:3000/');
    });

    it('Due date is empty', () => {
      goEdit();
      cy.get('#input-due-date').clear();
      submitFail();
      cy.get('[data-testid="invalid-label"]')
        .contains('span', 'Due date is required.')
        .should('exist');
    });

    it('Due date yesterday', () => {
      // cy.get("#input-due-date").clear();
      cy.get('#input-due-date').type(format(yesterday, 'yyyy-MM-dd'));
      submitFail();
      cy.get('[data-testid="invalid-label"]')
        .contains('span', 'Due date must be after today.')
        .should('exist');
    });

    it('Due date +5 years +1 day', () => {
      cy.get('#input-due-date').clear();
      cy.get('#input-due-date').type(format(after5YearPlus1Day, 'yyyy-MM-dd'));
      submitFail();
      cy.get('[data-testid="invalid-label"]')
        .contains('span', 'Due date must not over 5 years from today.')
        .should('exist');
    });
  });

  describe('Valid due date', () => {
    it('Visit to do list', () => {
      cy.visit('http://localhost:3000/');
    });

    it('Due date is today', () => {
      goEdit();
      cy.get('#input-due-date').type(format(today, 'yyyy-MM-dd'));
      submitSuccess();
    });

    it('Due date tomorrow', () => {
      goEdit();
      cy.get('#input-due-date').type(format(tomorrow, 'yyyy-MM-dd'));
      submitSuccess();
    });

    it('Due date +2.5 years', () => {
      goEdit();
      cy.get('#input-due-date').type(format(after2_5Year, 'yyyy-MM-dd'));
      submitSuccess();
    });

    it('Due date +5 years -1 day', () => {
      goEdit();
      cy.get('#input-due-date').type(format(after5YearMinus1Day, 'yyyy-MM-dd'));
      submitSuccess();
    });

    it('Due date +5 years', () => {
      goEdit();
      cy.get('#input-due-date').type(format(after5Year, 'yyyy-MM-dd'));
      submitSuccess();
    });
  });

  describe('Invalid title and date', () => {
    it('Visit to do list', () => {
      cy.visit('http://localhost:3000/');
    });

    it('Title and due date is empty', () => {
      goEdit();
      cy.get('#input-title').clear();
      cy.get('#input-due-date').clear();
      submitFail();
      cy.get('[data-testid="invalid-label"]').contains(
        'span',
        'Title is required.'
      );
      cy.get('[data-testid="invalid-label"]').contains(
        'span',
        'Due date is required.'
      );
    });
  });

  describe('Set to finish task', () => {
    it('Visit to do list', () => {
      cy.visit('http://localhost:3000/');
    });

    it('Tick finish', () => {
      goEdit();
      cy.get('#input-isFinished').check();
      submitSuccess();
    });
  });
});
