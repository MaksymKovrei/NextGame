import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Register from './Register';
import styles from './Register.module.css';

describe('<Register />', () => {

    beforeEach(() => {
        cy.mockAuthAPI();
    });

    it('відображає помилку, якщо паролі не співпадають', () => {
        cy.mountWithProviders(<Register />);

        cy.get('input[name="username"]').type('TestUser');
        cy.get('input[name="email"]').type('test@test.com');
        cy.get('input[name="password"]').type('password123');
        cy.get('input[name="confirmPassword"]').type('different123');
        cy.get(`.${styles.captchaCheckbox}`).check();

        cy.get(`.${styles.createButton}`).click();

        cy.contains(/співпадають|match/i).should('be.visible');
    });

    it('успішно реєструє користувача та перенаправляє на головну', () => {
        cy.mountWithProviders(
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<div data-testid="home">Home Page</div>} />
            </Routes>,
            { initialRoute: '/register' }
        );

        cy.get('input[name="username"]').type('ValidUser');
        cy.get('input[name="email"]').type('valid@test.com');
        cy.get('input[name="password"]').type('password123');
        cy.get('input[name="confirmPassword"]').type('password123');
        cy.get(`.${styles.captchaCheckbox}`).check();

        cy.get(`.${styles.createButton}`).click();

        cy.get('@authRegister').should('have.been.called');
        cy.get('[data-testid="home"]').should('be.visible');
    });

    it('відображає помилку від API', () => {
        const registerStub = cy.stub().as('regError').rejects(new Error('Користувач вже існує'));

        cy.mountWithProviders(<Register />, {
            authContextValue: {
                register: registerStub,
                user: null,
                isLoading: false
            }
        });

        cy.get('input[name="username"]').type('ExistingUser');
        cy.get('input[name="email"]').type('exists@test.com');
        cy.get('input[name="password"]').type('password123');
        cy.get('input[name="confirmPassword"]').type('password123');
        cy.get(`.${styles.captchaCheckbox}`).check();

        cy.get(`.${styles.createButton}`).click();

        cy.contains('вже існує').should('be.visible');
    });

    it('блокує поля під час завантаження', () => {
        const pendingStub = cy.stub().as('pendingReg').returns(new Promise(() => {}));

        cy.mountWithProviders(<Register />, {
            authContextValue: {
                register: pendingStub,
                user: null,
                isLoading: false
            }
        });

        cy.get('input[name="username"]').type('SlowUser');
        cy.get('input[name="email"]').type('slow@test.com');
        cy.get('input[name="password"]').type('password123');
        cy.get('input[name="confirmPassword"]').type('password123');
        cy.get(`.${styles.captchaCheckbox}`).check();

        cy.get(`.${styles.createButton}`).click();

        cy.get('input[name="username"]').should('be.disabled');
        cy.get(`.${styles.createButton}`).should('be.disabled');
    });
});