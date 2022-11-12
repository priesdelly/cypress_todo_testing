import { format } from "date-fns";
import fixture from "../fixtures/data.json";

context('Test add todo invalid', () => {
	const today = new Date();
	const yesterday = new Date();
	yesterday.setDate(today.getDate() - 1);
	const tomorrow = new Date();
	tomorrow.setDate(today.getDate() + 1);

	const after2_5Year = new Date();
	after2_5Year.setFullYear(after2_5Year.getFullYear() + 2.5);

	const after5Year = new Date();
	after5Year.setFullYear(after5Year.getFullYear() + 5);

	const after5YearMinus1Day = new Date();
	after5YearMinus1Day.setFullYear(after5YearMinus1Day.getFullYear() + 5);
	after5YearMinus1Day.setDate(after5YearMinus1Day.getDate() - 1);

	const after5YearPlus1Day = new Date();
	after5YearPlus1Day.setFullYear(after5YearPlus1Day.getFullYear() + 5);
	after5YearPlus1Day.setDate(after5YearPlus1Day.getDate() + 1);

	const clear = () => {
		cy.get('#input-title').clear();
		cy.get('#input-note').clear();
		cy.get('#input-due-date').clear();
	}

	const submitFail = () => {
		cy.intercept('POST', 'http://localhost:3000/api/todo').as('submitForm');
		cy.get('[data-cy="submit"]').click();
		cy.wait('@submitForm').then((interception) => {
			expect(interception.response?.statusCode).eq(400);
		})
	}

	describe('Invlid title', () => {
		it('Visit site', () => {
			cy.visit('http://localhost:3000/todo/add');
		})

		it('Title is empty', () => {
			clear();
			submitFail();
			cy.get('[data-testid="invalid-label"]').contains('span', 'Title is required.').should('exist');
		})

		it('Title add 1 character', () => {
			clear();
			cy.get('#input-title').type(fixture.character_1);
			submitFail();
			cy.get('[data-testid="invalid-label"]').contains('span', 'Title is required.').should('not.exist');
		})

		it('Title add 2 character', () => {
			clear();
			cy.get('#input-title').type(fixture.character_2);
			submitFail();
			cy.get('[data-testid="invalid-label"]').contains('span', 'Title is required.').should('not.exist');
			cy.get('[data-testid="invalid-label"]').contains('span', 'Length of title must less than 50 character.').should('not.exist');
		})

		it('Title add 25 character', () => {
			clear();
			cy.get('#input-title').type(fixture.character_25);
			submitFail();
			cy.get('[data-testid="invalid-label"]').contains('span', 'Title is required.').should('not.exist');
			cy.get('[data-testid="invalid-label"]').contains('span', 'Length of title must less than 50 character.').should('not.exist');
		})

		it('Title add 49 character', () => {
			clear();
			cy.get('#input-title').type(fixture.character_49);
			submitFail();
			cy.get('[data-testid="invalid-label"]').contains('span', 'Title is required.').should('not.exist');
			cy.get('[data-testid="invalid-label"]').contains('span', 'Length of title must less than 50 character.').should('not.exist');
		})

		it('Title add 50 character', () => {
			clear();
			cy.get('#input-title').type(fixture.character_50);
			submitFail();
			cy.get('[data-testid="invalid-label"]').contains('span', 'Title is required.').should('not.exist');
			cy.get('[data-testid="invalid-label"]').contains('span', 'Length of title must less than 50 character.').should('not.exist');
		})

		it('Title add 51 character', () => {
			clear();
			cy.get('#input-title').type(fixture.character_51);
			submitFail();
			cy.get('[data-testid="invalid-label"]').contains('span', 'Title is required.').should('not.exist');
			cy.get('[data-testid="invalid-label"]').contains('span', 'Length of title must less than 50 character.').should('exist');
		})
	})

	describe('Invalid date', () => {
		it('Visit site', () => {
			cy.visit('http://localhost:3000/todo/add');
		})

		it('Due date is empty', () => {
			clear();
			submitFail();
			cy.get('[data-testid="invalid-label"]').contains('span', 'Due date is required.').should('exist');
		})

		it('Due date yesterday', () => {
			clear();
			cy.get('#input-due-date').type(format(yesterday, 'yyyy-MM-dd'));
			submitFail();
			cy.get('[data-testid="invalid-label"]').contains('span', 'Due date must be after today.').should('exist');
			cy.get('[data-testid="invalid-label"]').contains('span', 'Due date must not over 5 years from today.').should('not.exist');
		})

		it('Due date is today', () => {
			clear();
			cy.get('#input-due-date').type(format(today, 'yyyy-MM-dd'));
			submitFail();
			cy.get('[data-testid="invalid-label"]').contains('span', 'Due date must be after today.').should('not.exist');
			cy.get('[data-testid="invalid-label"]').contains('span', 'Due date must not over 5 years from today.').should('not.exist');
		})

		it('Due date tomorrow', () => {
			clear();
			cy.get('#input-due-date').type(format(tomorrow, 'yyyy-MM-dd'));
			submitFail();
			cy.get('[data-testid="invalid-label"]').contains('span', 'Due date must be after today.').should('not.exist');
			cy.get('[data-testid="invalid-label"]').contains('span', 'Due date must not over 5 years from today.').should('not.exist');
		})

		it('Due date +2.5 years', () => {
			clear();
			cy.get('#input-due-date').type(format(after2_5Year, 'yyyy-MM-dd'));
			submitFail();
			cy.get('[data-testid="invalid-label"]').contains('span', 'Due date must be after today.').should('not.exist');
			cy.get('[data-testid="invalid-label"]').contains('span', 'Due date must not over 5 years from today.').should('not.exist');
		})

		it('Due date +5 years -1 day', () => {
			clear();
			cy.get('#input-due-date').type(format(after5YearMinus1Day, 'yyyy-MM-dd'));
			submitFail();
			cy.get('[data-testid="invalid-label"]').contains('span', 'Due date must be after today.').should('not.exist');
			cy.get('[data-testid="invalid-label"]').contains('span', 'Due date must not over 5 years from today.').should('not.exist');
		})

		it('Due date +5 years +1 day', () => {
			clear();
			cy.get('#input-due-date').type(format(after5YearPlus1Day, 'yyyy-MM-dd'));
			submitFail();
			cy.get('[data-testid="invalid-label"]').contains('span', 'Due date must be after today.').should('not.exist');
			cy.get('[data-testid="invalid-label"]').contains('span', 'Due date must not over 5 years from today.').should('exist');
		})
	})

	describe('Invlid note', () => {
		it('Visit site', () => {
			cy.visit('http://localhost:3000/todo/add');
		})

		it('Note is empty', () => {
			clear();
			submitFail();
			cy.get('[data-testid="invalid-label"]').contains('span', 'Length of note must less than 144 character.').should('not.exist');
		})

		it('Note add 1 character', () => {
			clear();
			cy.get('#input-note').type(fixture.character_1);
			submitFail();
			cy.get('[data-testid="invalid-label"]').contains('span', 'Length of note must less than 144 character.').should('not.exist');
		})

		it('Note add 2 character', () => {
			clear();
			cy.get('#input-note').type(fixture.character_2);
			submitFail();
			cy.get('[data-testid="invalid-label"]').contains('span', 'Length of note must less than 144 character.').should('not.exist');
		})

		it('Note add 72 character', () => {
			clear();
			cy.get('#input-note').type(fixture.character_72);
			submitFail();
			cy.get('[data-testid="invalid-label"]').contains('span', 'Length of note must less than 144 character.').should('not.exist');
		})

		it('Note add 143 character', () => {
			clear();
			cy.get('#input-note').type(fixture.character_143);
			submitFail();
			cy.get('[data-testid="invalid-label"]').contains('span', 'Length of note must less than 144 character.').should('not.exist');
		})

		it('Note add 144 character', () => {
			clear();
			cy.get('#input-note').type(fixture.character_144);
			submitFail();
			cy.get('[data-testid="invalid-label"]').contains('span', 'Length of note must less than 144 character.').should('not.exist');
		})

		it('Note add 145 character', () => {
			clear();
			cy.get('#input-note').type(fixture.character_145);
			submitFail();
			cy.get('[data-testid="invalid-label"]').contains('span', 'Length of note must less than 144 character.').should('exist');
		})
	})

	describe('Invalid title and date', () => {
		it('Visit site', () => {
			cy.visit('http://localhost:3000/todo/add');
		})

		it('Title and due date is empty', () => {
			clear();
			submitFail();
			cy.get('[data-testid="invalid-label"]').contains('span', 'Title is required.');
			cy.get('[data-testid="invalid-label"]').contains('span', 'Due date is required.');
		})
	})

})