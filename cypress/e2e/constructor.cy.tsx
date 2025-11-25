///<reference types = "cypress"/>

const TEST_URL = 'http://localhost:4000';
const BUN = '[data-cy="ingredient-643d69a5c3f7b9001cfa093c"]';

describe('Тест компонентов приложения', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', {fixture: 'ingredients.json'}).as('getIngredients');
    cy.viewport(1920, 1080);
    cy.visit(TEST_URL);
  })

  describe('Тест добавления ингредиента в конструктор', function() {
    it('Добавление булки', () => {
      cy.contains('Выберите булки').should('exist');
      cy.get(BUN).children('button').click();
      cy.get('[data-cy="constructor-bun-1"]').should('contain', "Краторная булка N-200i");
      cy.get('[data-cy="constructor-bun-2"]').should('contain', "Краторная булка N-200i");
      cy.contains('Выберите булки').should('not.exist');
    });
    it('Добавление начинки', () => {
      cy.contains('Выберите начинку').should('exist');
      cy.get('[data-cy="ingredient-643d69a5c3f7b9001cfa0941"]').children('button').click();
      cy.get('[data-cy="constructor-ingredients"]').should('contain', "Биокотлета из марсианской Магнолии");
      cy.contains('Выберите начинку').should('not.exist');
    });
    it('Добавление соуса', () => {
      cy.contains('Выберите начинку').should('exist');
      cy.get('[data-cy="ingredient-643d69a5c3f7b9001cfa0943"]').children('button').click();
      cy.get('[data-cy="constructor-ingredients"]').should('contain', "Соус фирменный Space Sauce");
      cy.contains('Выберите начинку').should('not.exist');
    });
  });

  describe('Тест модальных окон', function() {
    it('Открытие модального окна ингредиента', () => {
      cy.get(BUN).click();
      cy.get('[data-cy="modal"]').should('exist');
    });

    it('Отображение в модальном окне данных ингредиента', () => {
      cy.get(BUN).click();
      cy.get('[data-cy="modal"]').should('exist');
      cy.get('[data-cy="ingredient-image"]').should('be.visible');
      cy.get('[data-cy="ingredient-name"]').should('have.text', "Краторная булка N-200i");
      cy.get('[data-cy="ingredient-calories"]').should('have.text', "420");
      cy.get('[data-cy="ingredient-proteins"]').should('have.text', "80");
      cy.get('[data-cy="ingredient-fat"]').should('have.text', "24");
      cy.get('[data-cy="ingredient-carbohydrates"]').should('have.text', "53");
    });

    it('Закрытие модального окна ингредиента по клику на крестик', () => {
      cy.get(BUN).click();
      cy.get('[data-cy="modal"]').should('exist');
      cy.get('[data-cy="modal-close-button"]').click();
      cy.get('[data-cy="modal"]').should('not.exist');
    });

    it('Закрытие модального окна ингредиента по клавише ESC', () => {
      cy.get(BUN).click();
      cy.get('[data-cy="modal"]').should('exist');
      cy.get('body').type('{esc}');
      cy.get('[data-cy="modal"]').should('not.exist');
    });

    it('Закрытие модального окна ингредиента по клику на оверлей', () => {
      cy.get(BUN).click();
      cy.get('[data-cy="modal"]').should('exist');
      cy.get('[data-cy="modal-overlay"]').click({force:true});
      cy.get('[data-cy="modal"]').should('not.exist');
    });
  });
});


describe('Тест создания заказа', function() {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', {fixture: 'ingredients.json'}).as('getIngredients');
    cy.intercept('GET', 'api/auth/user', {fixture: 'user.json'}).as('getUser');
    cy.intercept('POST', 'api/orders', {fixture: 'order.json'}).as('createOrder');
    cy.setCookie('accessToken', 'test-access-token');
    window.localStorage.setItem('refreshToken', 'test-refresh-token');
    cy.viewport(1920, 1080);
    cy.visit(TEST_URL);
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    cy.clearLocalStorage('refreshToken');
  });

  it('Оформление заказа', () => {
    cy.get('[data-cy="ingredient-643d69a5c3f7b9001cfa093d"]').children('button').click();
    cy.get('[data-cy="ingredient-643d69a5c3f7b9001cfa0946"]').children('button').click();
    cy.get('[data-cy="ingredient-643d69a5c3f7b9001cfa0944"]').children('button').click();
    cy.get('[data-cy="order-button"]').contains('Оформить заказ').click();
    cy.wait('@createOrder');
    cy.get('[data-cy="modal"]').should('exist');
    cy.get('[data-cy="order-number"]').should('have.text', "95373");
    cy.get('[data-cy="modal-close-button"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
    cy.contains('Выберите булки').should('exist');
    cy.contains('Выберите начинку').should('exist');
  });
});
