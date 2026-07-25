/// <reference types="cypress" />
import { faker } from '@faker-js/faker';


it('first test', {tags: ['@smoke']}, () => {
    //inspeccionar > network | fetch/XHR | tags > Response
    //cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/tags', {fixture: 'tags.json'});
    cy.intercept('GET', '**/tags', {fixture: 'tags.json'});
    
    //inspeccionar > network | fetch/XHR | articles?limit=10&offset=0 > headers 
    //cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', {fixture: 'articles.json'});
    cy.intercept('GET', '**/articles*', {fixture: 'articles.json'});
    //'**/articles*' --> usamos el comodin: articles* para los parametros, ya que pueden modificarse segun el escenario. 
    // por ejemplo, si el limite de consulta es 9, y estamos esperando explicitamente 10, no hay coincidencia --> no se interceptará a la API 
    
    //hacer todos los mocks antes de iniciar la prueba real, en este caso sería antes de iniciar sesion
    //cy.loginToApplication2();
    cy.UIlogin();
})



it('modify api response', {retries: 2, tags: ['@smoke', '@likes']}, () => {
    cy.intercept('GET', '**/articles*', req => {
        req.continue( res => {
            res.body.articles[0].favoritesCount = 99999;
            res.send(res.body);
        })
    });
    //cy.loginToApplication2();
    cy.UIlogin();
    //cy.get('app-favorite-button').first().should('contain.text', '99999');
})



it.skip('Router Matcher', () => {
    cy.intercept({method: 'GET', pathname: 'tags'}, {fixture: 'tags.json'});    // <--
    cy.intercept('GET', '**/articles*', {fixture: 'articles.json'});
    cy.loginToApplication();
})



it('Waiting for APIs', () => {
    //cy.loginToApplication();

    //op 1
    //cy.get('app-article-list').should('contain.text', 'Bondar Academy');


    //op 2 -- no anda, falta esperar la carga de info
    /*
    cy.get('app-article-list').invoke('text').then( allArticleTexts => {
        expect(allArticleTexts).to.contain('Bondar Academy');
    });
    */

    //op 2 -- ok
    //cy.intercept('GET', '**/articles*').as('articleApiCall');
    /*
    cy.loginToApplication();
    cy.wait('@articleApiCall');
    cy.get('app-article-list').invoke('text').then( allArticleTexts => {
        expect(allArticleTexts).to.contain('Bondar Academy');
    });
    */


    //op 3
    cy.intercept('GET', '**/articles*').as('articleApiCall');   //alias api
    cy.UIlogin();
    //cy.loginToApplication();
    //esperamos a que la llamada a la API se complete
    //con el then obtenemos acceso a toda info relacionada con la llamada a la API para solicitar info
    //o info del response, para utilizar cualquier propiedad de este objeto para nuestro escenario de prueba
    cy.wait('@articleApiCall').then(apiArticleObject => {
        console.log(apiArticleObject);
        expect(apiArticleObject.response.body.articles[1].title).to.contain('Bondar Academy');
    });
    cy.get('app-article-list').invoke('text').then( allArticleTexts => {
        expect(allArticleTexts).to.contain('Bondar Academy');
    });
})



it.skip('create article', () => {    //crear articulo de messi, donde en la prueba definimos 1000 mg

    cy.request({
        url: Cypress.env('apiUrl')+'/users/login',   //inicio sesion primero
        method: 'POST',
        body: {
            "user": {
                "email": "johana.e.lauk@gmail.com",
                "password": "jLcypress"
            }
        }
    }).then(response => {
        expect(response.status).to.equal(200);
        const accessToken = 'Token ' + response.body.user.token;    //guardo el token

        cy.request({
            url: Cypress.env('apiUrl')+'/articles',  //creo un articulo
            method: 'POST',
            body: {
                "article": {
                    "title": "Lionel Messi",
                    "description": "Biografía",
                    "body": "Lionel Andrés Messi Cuccittini (Rosario, 24 de junio de 1987), es un futbolista argentino que juega como delantero o centrocampista. Desde 2023 integra el plantel del Inter Miami.\n\nJugó en el Barcelona más de veinte años, y ganó 34 títulos.\nTiene 47 títulos oficiales en su carrera profesional.\nEs el único en la historia que ha ganado 8 veces el Balón de Oro, 8 premios de la FIFA al mejor jugador del mundo, 6 Botas de Oro y 2 Balones de Oro de la Copa Mundial de Fútbol. \nEn 2020, se convirtió en el primer futbolista y el primer argentino en recibir un premio Laureus y fue incluido en el Dream Team del Balón de Oro.\nEs el máximo goleador histórico del Barcelona y de la selección argentina, de La Liga, la Supercopa de España, la Supercopa de Europa y el jugador no europeo con más goles en la Liga de Campeones de la UEFA. \nEs actualmente el jugador con más goles en la historia de la Copa Mundial de Fútbol de la FIFA.\n\nNacido y criado en la ciudad de Rosario, a los 13 años se radicó en España, donde el Barcelona accedió a pagar el tratamiento de la enfermedad hormonal que le habían diagnosticado de niño. \nPor su estilo de juego de pequeño driblador zurdo, pronto se lo comparó con su compatriota Diego Maradona quien, en 2007, lo declaró su «sucesor».",
                    "tagList": [
                        "messi"
                    ]
                }
            },
            headers: {'Authorization': accessToken }
        }).then( response => {
            expect(response.status).to.equal(201);      //cod creacion
            expect(response.body.article.title).to.equal('Lionel Messi');     //assertion
        })
    })

    cy.intercept('GET', '**/articles*', req => {
        req.continue( res => {
            res.body.articles[0].favoritesCount = 1000;
            res.send(res.body);
        })
    });

    cy.UIlogin();
    cy.get('app-favorite-button').first().should('contain.text', '1000');
})



it('delete article from interface', () => {    //loggin + guardo token + crear articulo + borrar articulo desde la pagina

    cy.request({
        url: Cypress.env('apiUrl')+'/users/login',   //inicio sesion primero
        method: 'POST',
        body: {
            "user": {
                "email": "johana.e.lauk@gmail.com",
                "password": "jLcypress"
            }
        }
    }).then(response => {
        expect(response.status).to.equal(200);
        const accessToken = 'Token ' + response.body.user.token;    //guardo el token

        cy.request({
            url: Cypress.env('apiUrl')+'/articles',  //creo un articulo
            method: 'POST',
            body: {
                "article": {
                    "title": "title test cypress",
                    "description": "about test article",
                    "body": "description de un articulo que creo como prueba",
                    "tagList": [
                        "test"
                    ]
                }
            },
            headers: {'Authorization': accessToken }
        }).then( response => {
            expect(response.status).to.equal(201);      //cod creacion
            expect(response.body.article.title).to.equal('title test cypress');     //assertion
        })
    })

    cy.loginToApplication();
    cy.contains('title test cypress').click();      //entramos al articulo
    cy.intercept('GET', '**/articles*').as('articleApiCall');
    cy.contains('button', 'Delete Article').first().click();    //presionamos boton borrar articulo
    cy.wait('@articleApiCall')
    cy.get('app-article-list').should('not.contain.text', 'title test cypress');    //verificamos que ya no exista
})



it('API testing End-to-end', {retries: 2}, () => {    //loggin + guardar token + crear articulo + eliminar articulo

    cy.request({
        url: Cypress.env('apiUrl')+'/users/login',   //inicio sesion primero
        method: 'POST',
        body: {
            "user": {
                "email": "johana.e.lauk@gmail.com",
                "password": "jLcypress"
            }
        }
    }).then(response => {
        expect(response.status).to.equal(200);
        const accessToken = 'Token ' + response.body.user.token;    //guardo el token

        cy.request({
            url: Cypress.env('apiUrl')+'/articles',  //creo un articulo
            method: 'POST',
            body: {
                "article": {
                    "title": "Selección Argentina",
                    "description": "Plantilla Mundial 2026",
                    "body": "ARQUEROS: \nEmiliano Martínez,\nGerónimo Rulli,\nJuan Musso\n\nDEFENSORES: \nNahuel Molina,\nGonzalo Montiel,\nCristian Romero,\nMarcos Senesi,\nNicolás Otamendi,\nLisandro Martínez,\nNicolás Tagliafico,\nFacundo Medina\n\nMEDIOCAMPISTAS: \nLeandro Paredes,\nAlexis Mac Allister,\nRodrigo De Paul,\nGiovani Lo Celso,\nExequiel Palacios,\nEnzo Fernández,\nValentín Barco\n\nDELANTEROS: \nLionel Messi,\nJulián Álvarez,\nLautaro Martínez,\nThiago Almada,\nNicolás Paz,\nNicolás González,\nGiuliano Simeone,\nJosé Manuel López",
                    "tagList": [
                        "argentina",
                        "mundial",
                        "jugadores"
                    ]
                }
            },
            headers: {'Authorization': accessToken }
        }).then( response => {
            expect(response.status).to.equal(201);
            expect(response.body.article.title).to.equal('Selección Argentina');    //assertion
        })
        
        cy.request({    
            url: Cypress.env('apiUrl')+'/articles?limit=20&offset=0',
            method: 'GET',
            headers: {'Authorization': accessToken }
        }).then( response => {
            expect(response.status).to.equal(200);
            expect(response.body.articles[0].title).to.equal('Selección Argentina');    //assertion -correcto mediante un GET
            const slugID = response.body.articles[0].slug;

            cy.request({
                url: `${Cypress.env('apiUrl')}/articles/${slugID}`,    //borramos el articulo creado
                method: 'DELETE',
                headers: {'Authorization': accessToken }
            }).then( response => {
                expect(response.status).to.equal(204);
            })
        })

        cy.request({
            url: Cypress.env('apiUrl')+'/articles?limit=20&offset=0',     //verificamos que se haya borrado
            method: 'GET',
            headers: {'Authorization': accessToken }
        }).then( response => {
            expect(response.status).to.equal(200);
            expect(response.body.articles[0].title).to.not.equal('Selección Argentina');
        })
    })
})



it('create & delete article', () => {    //crear articulo + borrar articulo desde la pagina

    cy.loginToApplication2();

    cy.get('@accessToken').then(accessToken => {    // 
        cy.request({
            //url: 'https://conduit-api.bondaracademy.com/api/articles',  //creo un articulo
            url: Cypress.env('apiUrl')+'/articles',
            method: 'POST',
            body: {
                "article": {
                    "title": "2title test cypress",
                    "description": "2about test article",
                    "body": "2description de un articulo que creo como prueba",
                    "tagList": [
                        "2test"
                    ]
                }
            },
            headers: {'Authorization': 'Token ' + accessToken }
        }).then( response => {
            expect(response.status).to.equal(201);      //cod creacion
            expect(response.body.article.title).to.equal('2title test cypress');     //assertion
        })
    })

    cy.contains('2title test cypress').click();      //entramos al articulo
    cy.intercept('GET', '**/articles*').as('articleApiCall');
    cy.contains('button', 'Delete Article').first().click();    //presionamos boton borrar articulo
    cy.wait('@articleApiCall')
    cy.get('app-article-list').should('not.contain.text', '2title test cypress');    //verificamos que ya no exista
})


it('#2 create & delete article', () => {    //crear articulo + borrar articulo desde la pagina
    const titleOfTheArticle = faker.person.fullName();
    cy.loginToApplication2();

    cy.get('@accessToken').then(accessToken => {
        cy.request({
            url: Cypress.env('apiUrl')+'/articles',
            method: 'POST',
            body: {
                "article": {
                    "title": titleOfTheArticle,
                    "description": faker.person.jobTitle(),
                    "body": faker.lorem.paragraph(15),
                    "tagList": [
                        "3test"
                    ]
                }
            }, 
            headers: {'Authorization': 'Token ' + accessToken }
        }).then( response => {
            expect(response.status).to.equal(201);      //cod creacion
            expect(response.body.article.title).to.equal(titleOfTheArticle);     //assertion
        })
    })

    cy.contains(titleOfTheArticle).click();      //entramos al articulo
    cy.intercept('GET', '**/articles*').as('articleApiCall');
    cy.contains('button', 'Delete Article').first().click();    //presionamos boton borrar articulo
    cy.wait('@articleApiCall')
    cy.get('app-article-list').should('not.contain.text', titleOfTheArticle);    //verificamos que ya no exista
})