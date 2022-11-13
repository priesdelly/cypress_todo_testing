import { format } from 'date-fns';
import fixture from '../fixtures/data.json';
import { ITodo } from '../../interfaces/todo.interface';

context('Test delete todo', () => {
  let dataId: string;

  // describe('Delete 1 item', () => {
  //   it('Visit site', () => {
  //     cy.visit('http://localhost:3000/');
  //   });

  //   it('Click delete button', () => {
  //     cy.intercept('DELETE', 'http://localhost:3000/api/todo/' + dataId).as(
  //       'delete'
  //     );
  //     cy.get(`[data-testid="btn-delete-${dataId}"]`).click();
  //     cy.wait('@delete').then((interception) => {
  //       expect(interception.response?.statusCode).eq(200);
  //     });
  //   });

  //   it('Data should not exist', () => {
  //     const tr = cy.get(`[data-testid="tr-${dataId}"]`);
  //     tr.should('not.exist');
  //   });
  // });

  // describe('Delete all items', () => {

  // });

});
