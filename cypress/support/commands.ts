/// <reference types = "cypress"/>

type TCheckModalType = 'exist' | 'not.exist';

const MODAL = '[data-cy="modal"]';

Cypress.Commands.add('addIngredient', (id, name) => {
  cy.contains('Выберите начинку').should('exist');
  cy.get(`[data-cy="ingredient-${id}"]`).children('button').click();
  cy.get('[data-cy="constructor-ingredients"]').should('contain', name);
  cy.contains('Выберите начинку').should('not.exist');
});

Cypress.Commands.add('checkModal', (checkType: TCheckModalType) => {
  cy.get(MODAL).should(checkType);
});

Cypress.Commands.add('closeModal', () => {
  cy.get(MODAL).as('modal')
  cy.get('@modal').should('exist');
  cy.get('@modal').find('[data-cy="modal-close-button"]').click();
  cy.get('@modal').should('not.exist');
});

export {}

declare global {
  namespace Cypress {
    interface Chainable {
      addIngredient(id: string, name: string): Chainable<void>;
      checkModal(check: TCheckModalType): Chainable<void>;
      closeModal(): Chainable<void>;
    }
  }
}
