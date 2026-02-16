import React from 'react';
import Layout from './Layout';
import styles from './Layout.module.css';

describe('<Layout />', () => {

    it('відображає основну структуру макета з хедером, main та футером', () => {
        cy.mountWithProviders(
            <Layout>
                <p>Test Content</p>
            </Layout>
        );

        cy.get(`.${styles.layout}`).should('be.visible');
        cy.get('nav').should('exist');
        cy.get(`.${styles.main}`).should('be.visible');
        cy.get(`.${styles.footer}`).should('be.visible');
    });

    it('коректно рендерить передані дочірні елементи всередині main', () => {
        const testMessage = 'Унікальний тестовий контент';

        cy.mountWithProviders(
            <Layout>
                <div data-testid="child-content">{testMessage}</div>
            </Layout>
        );

        cy.get(`.${styles.main}`).within(() => {
            cy.get('[data-testid="child-content"]').should('have.text', testMessage);
        });
    });

    it('містить правильний текст про політику конфіденційності у футері', () => {
        cy.mountWithProviders(<Layout />);

        cy.get(`.${styles.footer}`).within(() => {
            cy.contains('protected by reCAPTCHA Enterprise').should('be.visible');
            cy.contains('Google Privacy Policy').should('be.visible');
        });
    });
});