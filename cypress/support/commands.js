// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import 'cypress-iframe';


Cypress.Commands.add('openHomePage', () => {
    cy.visit("/");
})


Cypress.Commands.add('loginToApplication', () => {
    cy.visit("/");
    cy.contains('Sign in').click();
    cy.get('[placeholder="Email"]').type('johana.e.lauk@gmail.com');
    cy.get('[placeholder="Password"]').type('jLcypress');
    cy.contains('button', 'Sign in').click();
})


Cypress.Commands.add('loginToApplication2', () => {
    
    cy.request({
        url: 'https://conduit-api.bondaracademy.com/api/users/login',   //inicio sesion primero
        method: 'POST',
        body: {
            "user": {
                //"email": "johana.e.lauk@gmail.com",
                //"password": "jLcypress"
                "email": Cypress.env('username'),
                "password": Cypress.env('password')
            }
        }
    }).then( response => {
        expect(response.status).to.equal(200);
        const accessToken = response.body.user.token;    //guardo el token
        /*
        hasta ahora accessToken es simplemente un string.
        ejemplo --> const accessToken = "ABC123"
        Pero Cypress no puede ponerle un alias directamente a un string.
        Por eso usamos: cy.wrap() --> que convierte ese valor en un objeto manejado por Cypress.
        .as('accessToken'); --> le pone un alias.
        Ahora Cypress guarda internamente: @accessToken
        */
        
        cy.wrap(accessToken).as('accessToken');
        cy.visit("/", {
            onBeforeLoad(win){
                win.localStorage.setItem('jwtToken', accessToken);
            }
        });
    });
})


