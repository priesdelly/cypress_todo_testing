import { format } from 'date-fns';
import fixture from '../fixtures/data.json';
import { ITodo } from '../../interfaces/todo.interface';

context('Test add todo', () => {
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

	const clear = () => {
		cy.get('#input-title').clear();
		cy.get('#input-note').clear();
		cy.get('#input-due-date').clear();
	}

  const goAdd = () => {
    const btn = cy.get('[data-testid="btn-add"]');
    btn.click();
    cy.location('href').should('include', '/todo/add');
  };

  const submitSuccess = () => {
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
  };

	const submitFail = () => {
		cy.intercept('POST', 'http://localhost:3000/api/todo').as('submitForm');
		cy.get('[data-cy="submit"]').click();
		cy.wait('@submitForm').then((interception) => {
			expect(interception.response?.statusCode).eq(400);
		})
	}

  describe('Invalid title', () => {
    it('Visit to do list', () => {
      cy.visit('http://localhost:3000/');
    });

    it('Title add empty', () => {
      goAdd();
      clear();
      cy.get('#input-due-date').type(format(tomorrow, 'yyyy-MM-dd'));
      submitFail();
      cy.get('[data-testid="invalid-label"]')
        .contains('span', 'Title is required.')
        .should('exist');
    });

    it('Title add 51 characters', () => {
      clear();
      cy.get('#input-title').type(fixture.character_51);
      cy.get('#input-due-date').type(format(tomorrow, 'yyyy-MM-dd'));
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
    it('Visit to to do list', () => {
      cy.visit('http://localhost:3000/');
    });

    it('Title add 1 characters', () => {
      goAdd();
      clear();
      cy.get('#input-title').type(fixture.character_1);
      cy.get('#input-due-date').type(format(tomorrow, 'yyyy-MM-dd'));
      submitSuccess();
    });

    it('Title add 2 characters', () => {
      goAdd();
      clear();
      cy.get('#input-title').type(fixture.character_2);
      cy.get('#input-due-date').type(format(tomorrow, 'yyyy-MM-dd'));
      submitSuccess();
    });

    it('Title add 25 characters', () => {
      goAdd();
      clear();
      cy.get('#input-title').type(fixture.character_25);
      cy.get('#input-due-date').type(format(tomorrow, 'yyyy-MM-dd'));
      submitSuccess();
    });

    it('Title add 49 characters', () => {
      goAdd();
      clear();
      cy.get('#input-title').type(fixture.character_49);
      cy.get('#input-due-date').type(format(tomorrow, 'yyyy-MM-dd'));
      submitSuccess();
    });

    it('Title add 50 characters', () => {
      goAdd();
      clear();
      cy.get('#input-title').type(fixture.character_50);
      cy.get('#input-due-date').type(format(tomorrow, 'yyyy-MM-dd'));
      submitSuccess();
    });

  });

  describe('Invalid note', () => {
    it('Visit to do list', () => {
      cy.visit('http://localhost:3000/');
    });

    it('Note add 145 characters', () => {
      goAdd();
      clear();
      cy.get('#input-note').type(fixture.character_145);
      cy.get('#input-title').type(fixture.character_25);
      cy.get('#input-due-date').type(format(tomorrow, 'yyyy-MM-dd'));
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

    it('Note add 1 characters', () => {
      goAdd();
      clear();
      cy.get('#input-note').type(fixture.character_1);
      cy.get('#input-title').type(fixture.character_25);
      cy.get('#input-due-date').type(format(tomorrow, 'yyyy-MM-dd'));
      submitSuccess();
    });

    it('Note add 2 characters', () => {
      goAdd();
      clear();
      cy.get('#input-note').type(fixture.character_2);
      cy.get('#input-title').type(fixture.character_25);
      cy.get('#input-due-date').type(format(tomorrow, 'yyyy-MM-dd'));
      submitSuccess();
    });

    it('Note add 72 characters', () => {
      goAdd();
      clear();
      cy.get('#input-note').type(fixture.character_72);
      cy.get('#input-title').type(fixture.character_25);
      cy.get('#input-due-date').type(format(tomorrow, 'yyyy-MM-dd'));
      submitSuccess();
    });

    it('Note add 143 characters', () => {
      goAdd();
      clear();
      cy.get('#input-note').type(fixture.character_143);
      cy.get('#input-title').type(fixture.character_25);
      cy.get('#input-due-date').type(format(tomorrow, 'yyyy-MM-dd'));
      submitSuccess();
    });

    it('Note add 144 characters', () => {
      goAdd();
      clear();
      cy.get('#input-note').type(fixture.character_144);
      cy.get('#input-title').type(fixture.character_25);
      cy.get('#input-due-date').type(format(tomorrow, 'yyyy-MM-dd'));
      submitSuccess();
    });
  });

  describe('Invalid due date', () => {
    it('Visit to do list', () => {
      cy.visit('http://localhost:3000/');
    });

    it('Due date is empty', () => {
      goAdd();
      clear();
      cy.get('#input-title').type(fixture.character_25);
      submitFail();
      cy.get('[data-testid="invalid-label"]')
        .contains('span', 'Due date is required.')
        .should('exist');
    });

    it('Due date yesterday', () => {
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
      goAdd();
      cy.get('#input-title').type(fixture.character_25);
      cy.get('#input-due-date').type(format(today, 'yyyy-MM-dd'));
      submitSuccess();
    });

    it('Due date tomorrow', () => {
      goAdd();
      cy.get('#input-title').type(fixture.character_25);
      cy.get('#input-due-date').type(format(tomorrow, 'yyyy-MM-dd'));
      submitSuccess();
    });

    it('Due date +2.5 years', () => {
      goAdd();
      cy.get('#input-title').type(fixture.character_25);
      cy.get('#input-due-date').type(format(after2_5Year, 'yyyy-MM-dd'));
      submitSuccess();
    });

    it('Due date +5 years -1 day', () => {
      goAdd();
      cy.get('#input-title').type(fixture.character_25);
      cy.get('#input-due-date').type(format(after5YearMinus1Day, 'yyyy-MM-dd'));
      submitSuccess();
    });

    it('Due date +5 years', () => {
      goAdd();
      cy.get('#input-title').type(fixture.character_25);
      cy.get('#input-due-date').type(format(after5Year, 'yyyy-MM-dd'));
      submitSuccess();
    });

  });

  describe('Invalid title and date', () => {
    it('Visit to do list', () => {
      cy.visit('http://localhost:3000/');
    });

    it('Title and due date is empty', () => {
      goAdd();
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

});
