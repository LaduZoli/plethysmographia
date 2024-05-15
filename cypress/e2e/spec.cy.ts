describe('Weboldal tesztelése', () => {
  it('Ellenőrzi az oldal címét', () => {
    cy.visit('https://plethysmographia.web.app/home')

    cy.title().should('eq', 'Plethysmograph')
  })

  it('Bejelentkezés megfelelő adatokkal', () => {
    cy.visit('https://plethysmographia.web.app/login');

    cy.get("#mat-mdc-form-field-label-0").click();
    cy.get("#mat-mdc-form-field-label-0").type('test@test.com');

    cy.get("#mat-mdc-form-field-label-2").click();
    cy.get("#mat-mdc-form-field-label-2").type('test123');

    cy.get('[test-id="login-button"]').click();
    
    cy.wait(2000);
    
    cy.get('span[style="display: flex; align-items: center;"]').should('contain', 'Teszt Elek');

  })

  it('Bejelentkezés hibás adatokkal', () => {
    cy.visit('https://plethysmographia.web.app/login');

    cy.get("#mat-mdc-form-field-label-0").click();
    cy.get("#mat-mdc-form-field-label-0").type('test@test.com');

    cy.get("#mat-mdc-form-field-label-2").click();
    cy.get("#mat-mdc-form-field-label-2").type('test12');

    cy.get('[test-id="login-button"]').click();

    cy.get("#mat-mdc-error-4").should("contain", " Helytelen e-mail vagy jelszó. Próbáld újra! ");
  })

  it('Kijelentkezés', () => {
    cy.visit('https://plethysmographia.web.app/login');

    cy.get("#mat-mdc-form-field-label-0").click();
    cy.get("#mat-mdc-form-field-label-0").type('test@test.com');

    cy.get("#mat-mdc-form-field-label-2").click();
    cy.get("#mat-mdc-form-field-label-2").type('test123');

    cy.get('[test-id="login-button"]').click();
    
    cy.wait(2000);
    
    cy.get('span[style="display: flex; align-items: center;"]').should('contain', 'Teszt Elek');

    cy.get('button.mat-mdc-menu-trigger').click();

    cy.contains('span.mat-mdc-menu-item-text', 'Kijelentkezés').click();

    cy.contains('h1', 'Pletizmográfia');

  })

  it('Adatok megjelenése a bejelenkezett kezdőoldalon', () => {
    cy.visit('https://plethysmographia.web.app/login');

    cy.get("#mat-mdc-form-field-label-0").click();
    cy.get("#mat-mdc-form-field-label-0").type('test@test.com');

    cy.get("#mat-mdc-form-field-label-2").click();
    cy.get("#mat-mdc-form-field-label-2").type('test123');

    cy.get('[test-id="login-button"]').click();
    
    cy.wait(2000);
    
    cy.get('mat-card').should('have.length', 4);
  })

  it('Pulzusmegjelenítő tábázat látható-e', () => {
    cy.visit('https://plethysmographia.web.app/login');

    cy.get("#mat-mdc-form-field-label-0").click();
    cy.get("#mat-mdc-form-field-label-0").type('test@test.com');

    cy.get("#mat-mdc-form-field-label-2").click();
    cy.get("#mat-mdc-form-field-label-2").type('test123');

    cy.get('[test-id="login-button"]').click();
    
    cy.wait(2000);
    
    cy.contains('.mdc-button__label', 'Mérések lista').click();

    cy.get('table#measurement-table').should('be.visible');
  })
})
