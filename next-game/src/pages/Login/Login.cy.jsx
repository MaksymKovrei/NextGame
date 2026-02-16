import React from 'react';
import Login from './Login';
import styles from './Login.module.css';

describe('<Login />', () => {

    it('відображає форму входу та всі необхідні елементи інтерфейсу', () => {
        cy.mountWithProviders(<Login />);

        cy.get(`.${styles.loginContainer}`).should('be.visible');
        cy.get(`.${styles.leftPanel}`).should('be.visible');
        cy.get(`.${styles.rightPanel}`).should('be.visible');

        cy.get('input[name="email"]').should('be.visible');
        cy.get('input[name="password"]').should('be.visible');
        cy.get(`.${styles.submitButton}`).should('be.visible');
    });

    it('дозволяє вводити електронну пошту та пароль', () => {
        cy.mountWithProviders(<Login />);

        cy.get('input[name="email"]')
            .type('test@example.com')
            .should('have.value', 'test@example.com');

        cy.get('input[name="password"]')
            .type('password123')
            .should('have.value', 'password123');
    });

    it('перемикає видимість пароля при кліку на іконку ока', () => {
        cy.mountWithProviders(<Login />);

        cy.get('input[name="password"]')
            .should('have.attr', 'type', 'password');

        cy.get(`.${styles.togglePassword}`).click();

        cy.get('input[name="password"]')
            .should('have.attr', 'type', 'text');

        cy.get(`.${styles.togglePassword}`).click();

        cy.get('input[name="password"]')
            .should('have.attr', 'type', 'password');
    });

    it('викликає функцію входу з правильними даними при сабміті форми', () => {
        // ВИПРАВЛЕННЯ: cy.stub() замість cy.spy(), щоб використати .resolves()
        const loginStub = cy.stub().as('loginSpy').resolves();

        cy.mountWithProviders(<Login />, {
            authContextValue: {
                login: loginStub
            }
        });

        cy.get('input[name="email"]').type('user@test.com');
        cy.get('input[name="password"]').type('securePass');
        cy.get(`.${styles.submitButton}`).click();

        cy.get('@loginSpy').should('have.been.calledWith', 'user@test.com', 'securePass');
    });

    it('відображає повідомлення про помилку при невдалому вході', () => {
        const errorMessage = 'Невірна пошта або пароль';
        // Тут також використовуємо stub для помилки (.rejects)
        const loginStub = cy.stub().as('loginErrorSpy').rejects(new Error(errorMessage));

        cy.mountWithProviders(<Login />, {
            authContextValue: {
                login: loginStub
            }
        });

        cy.get('input[name="email"]').type('wrong@test.com');
        cy.get('input[name="password"]').type('wrongpass');
        cy.get(`.${styles.submitButton}`).click();

        cy.get(`.${styles.error}`)
            .should('be.visible')
            .and('contain', errorMessage);
    });

    it('блокує кнопку входу та показує стан завантаження під час запиту', () => {
        // Емулюємо затримку відповіді
        const loginStub = cy.stub().as('loginDelaySpy').callsFake(() => new Promise(resolve => setTimeout(resolve, 1000)));

        cy.mountWithProviders(<Login />, {
            authContextValue: {
                login: loginStub
            }
        });

        cy.get('input[name="email"]').type('wait@test.com');
        cy.get('input[name="password"]').type('pass');
        cy.get(`.${styles.submitButton}`).click();

        cy.get(`.${styles.submitButton}`).should('be.disabled');
    });

    it('містить коректні посилання на реєстрацію та відновлення пароля', () => {
        cy.mountWithProviders(<Login />);

        cy.get(`.${styles.registerLink}`).should('have.attr', 'href', '/register');
        cy.get(`.${styles.forgotLink}`).should('have.attr', 'href', '/forgot-password');
    });

    it('зберігає стан чекбокса "Запам\'ятати мене"', () => {
        cy.mountWithProviders(<Login />);

        cy.get('input[type="checkbox"]').check();
        cy.get('input[type="checkbox"]').should('be.checked');
    });
});