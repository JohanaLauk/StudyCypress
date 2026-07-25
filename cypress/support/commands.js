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
                "email": "johana.e.lauk@gmail.com",
                "password": "jLcypress"
                //"email": Cypress.env('username'),
                //"password": Cypress.env('password')
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


Cypress.Commands.add("UIlogin", () => {
    cy.session('user', () => {
        cy.visit("/");
        cy.contains("Sign in").click();
        cy.get('[placeholder="Email"]').type(Cypress.env('username'));
        cy.get('[placeholder="Password"]').type(Cypress.env('password'));
        cy.contains('button', 'Sign in').click();
        cy.location('pathname').should('eq', '/');  //verificamos que se haya loggeado correctamente
    }) /*, 
    {
        //es para reutizar la cache, ejemplo sesiones
        //https://docs.cypress.io/api/commands/session#switching-sessions-inside-tests
        cacheAcrossSpecs: true
    }*/

    //este metodo no se encarga de la apertura de la pagina, asi que despues de la sesion de Cy, debemos abrir la pagina una vez mas
    cy.visit("/");
})

/*
1) loginToApplication2 → hace login directamente contra la API.
2) UIlogin → hace login a través de la interfaz gráfica y usa cy.session() para reutilizar la sesión.

1)
Test Cypress
     │ POST /api/users/login
     ▼
Backend / API
     │ devuelve token
     ▼
accessToken
     │ guardamos token
     ▼
localStorage
     │
     ▼
Aplicación ya autenticada

>>Se saltea esto:
Abrir página
    ↓
Click Sign in
    ↓
Escribir email
    ↓
Escribir password
    ↓
Click Sign in


2) Acá sí estás haciendo el login como lo haría un usuario real.
cy.visit("/")
      ↓
Click "Sign in"
      ↓
Ingresar email
      ↓
Ingresar password
      ↓
Click "Sign in"
      ↓
Aplicación autentica
      ↓
Usuario logueado
*/