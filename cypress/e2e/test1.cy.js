// permite intellisense dentro del codigo, permitiendo escribir Cy y llamar a los dif metodos de Cypress
/// <reference types="cypress" />

//DOCUMENTACION
//https://docs.cypress.io/app/references/configuration#Global


/*
// metodo para abrir una pagina web
beforeEach("Open test application", () => {
    cy.visit("/")   //solo el slash porque ya definimos la url en cypress.config.js
})

//afterEach()


//1° arg: nombre de la prueba
//2° arg: funcion de devolucion de llamada de js
it('Hello world 1', () => {

})

it('Hello world 2', () => {
    
})

describe("Test  Suite 1", () => {
    
    it('Hello world 3', () => {

    })

    it('Hello world 4', () => {
        
    })

    describe("Test  Suite 2", () => {
        it('Hello world 5', () => {

        })

        it('Hello world 6', () => {
            
        })
    })
})
*/

//---------------------------------------------------------------

beforeEach("Open test application", () => {
    cy.visit("/")
    cy.contains('Forms').click();
    cy.contains('Form Layouts').click();
})



it('Hello world 1', () => {
    //buscar por tag (etiqueta)
    cy.get("input");

    //buscar por valor ID
    cy.get("#inputEmail1");

    //buscar por clase
    cy.get(".input-full-width");

    //by atributo
    cy.get("[fullwidth]");

    //by atributo con valor
    cy.get('[placeholder="Email"]');

    //by valor de clase entera
    cy.get('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]');

    //by elemento con varias propiedades
    cy.get('[placeholder="Email"][fullwidth]');     //no se ponen espacios entre corchetes si se quiere usar un unico localizador
    cy.get('input[placeholder="Email"]');

    //find by data-cy attribute
    cy.get('[data-cy="inputEmail1"]');

    /*
    ejemplo:
    <div class="form-group row">
        <label class="col-sm-3 label">Radios</label>
    </div>

    >> How to find <label> web element by text value --> cy.contains('Radios')
    este comando busca elementos en el DOM que contengan el texto especificado

    >> Get the value of the class for <label> web element using "invoke()" command --> cy.get('label').invoke('attr', 'class')" 
    obtiene el atributo "class" del elemento <label> seleccionado. 
    permite acceder a propiedades específicas de los elementos HTML

    >> Get the <div>, save the context using "then()" and then click on "label" --> 
    cy.get('div').then(element => {   
        cy.wrap(element).find('label').click()
    })
        
    >> What syntax for the assertion of the text "Radios" is correct? --> cy.get('label').should('contain', 'Radios')
    verifica que el texto contenido en el elemento <label> sea "Radios"

    >> What syntax for the assertion of the class value "label" is correct? --> 
    cy.get('label').invoke('attr', 'class').then(class => {
        expect(class).to.contain('label')
    })
    permite obtener el valor de la clase del elemento <label>, y luego verificar que contenga la subcadena "label", 
    ya que el valor del atributo es "col-sm-3 label".
    */
})


//Theory
//get() --> to find elements on the page globally
//find() --> to find only child alements
//contains() --> to find web elements by text

it('Cypress Locator Methods', () => {
    cy.contains('Sign In', {matchCase: false});     //desactiva la coincidencia de mayus y minus
    cy.contains('[status="warning"]', 'Sign in');   //busca el componente que dice Sign in y tiene la caracteristica de warning
    cy.contains('Submit');  //obtiene la primer coincidencia (hay 3 pero muestra la primera)
    //cy.get('Submit');     //no anda, no se usa asi
    cy.contains('[status="primary"]', 'Submit');    //obtiene el boton submit que tiene la caracteristica de primary
    cy.contains('nb-card', 'Horizontal fo').find('button');     //find - encuentra 1 unica coincidencia
    cy.contains('nb-card', 'Horizontal fo').contains('Sign in');    //contains - encuentra 1 unica coincidencia
    //cy.contains('nb-card', 'Horizontal fo').contains('Submit');   //no existe boton con ese nombre
    cy.contains('nb-card', 'Horizontal fo').get('button');      //get - encuentra 8 coincidencias
})

it('Child Elements', () => {
    /*
    ejemplo:
    <div class="form-group row">
        <label class="col-sm-3 label">Radios</label>
    </div>

    How to find <label> web element as a child element of <div> --> cy.get('div').find('label')

    Utilizando get primero para seleccionar el div y luego find para buscar el label dentro de ese contexto, 
    aseguras que la selección se limita solo a los hijos del div.
    */

    //cy.contains('nb-card', 'Basic form');
    cy.contains('nb-card', 'Using the Grid').find('.row').find('button');

    //cy.get('nb-card').find('nb-radio-group').contains('Option 1');
    cy.get('nb-card nb-radio-group').contains('Option 1');      //the same que la anterior

    //cy.get('nb-card > nb-radio-group');     //no anda porq el 2°componente no está abajo del 1°comp
    //cy.get('nb-card > nb-card-body');
    //cy.get('nb-card > nb-card-body [placeholder="Email"]');
    cy.get('nb-card > nb-card-body [placeholder="Jane Doe"]');
})

it('Parent Elements', () => {

    cy.get('#inputEmail1').parents('form').find('button');

    cy.contains('Using the Grid').parent().find('button');
    //cy.contains('Using the Grid').parent() the same that cy.contains('nb-card', 'Using the Grid')

    cy.get("#inputEmail1").parentsUntil('nb-card-body').find('button');
})


it('Cypress Chains', () => {

    cy.get('#inputEmail1')
        .parents('form')
        .find('button')
        .click();

    cy.get('#inputEmail1')
        .parents('form')
        .find('nb-radio')
        .first()
        .should('have.text', 'Option 1');
})


it('Reusing Locators', () => {

    //NO FUNCIONA, NO HACER!!
    //const inputEmail1 = cy.get('#inputEmail1');
    //inputEmail1.parents('form').find('button');
    //inputEmail1.parents('form').find('nb-radio');

    //ALIAS
    //cy.get('#inputEmail1').as('inputEmail1');
    //cy.get('@inputEmail1').parents('form').find('button');
    //cy.get('@inputEmail1').parents('form').find('nb-radio');

    //METODO then() --> no se puede retornar nada
    // se usa el wrap porque con el then(), el dato "inputEmail" queda como un objeto JQuery
    cy.get('#inputEmail1').then(inputEmail => {
        cy.wrap(inputEmail).parents('form').find('button');
        cy.wrap(inputEmail).parents('form').find('nb-radio');
        cy.wrap('Hello').should('equal', 'Hello').then(hola => {return hola});
    }).should('equal', 'Hello')

    cy.get('#inputEmail1').then(inputEmail => {
        cy.wrap(inputEmail).parents('form').find('button');
        cy.wrap(inputEmail).parents('form').find('nb-radio');
        cy.wrap('Hello').should('equal', 'Hello');
        cy.wrap(inputEmail).as('inputEmail2');
    })
})


it('Extracting Values', () => {

    //1. usando metodo JQuery --> extraer texto visible de la pagina
    cy.get('[for="exampleInputEmail1"]').then(label => {
        const emailLabel = label.text()
        console.log(emailLabel)
    });

    //2. uso del comando invocar
    cy.get('[for="exampleInputEmail1"]').invoke('text').then(emailLabel => {
        console.log(emailLabel);
    })
    cy.get('[for="exampleInputEmail1"]').invoke('text').as('emailLabel');
    cy.get('[for="exampleInputEmail1"]').should('contain', 'Email address');    //es una assert

    //EXPLICACION
    /* cy.get('[for="exampleInputEmail1"]').invoke('text') --> obtiene el texto del label
    entonces si el HTML fuera: <label for="exampleInputEmail1">Email address</label>
    el resultado es: "Email address"

    luego al usar el then() --> recibe el valor, por lo que el alias emailLabel contiene "Email address"
    que luego lo imprime en consola
    pero ojo, porque ese valor solo existe dentro del then(), por lo que no sirve esto: console.log(emailLabel);

    entonces, al usar el alias (as), si guardamos el resultado en @emailLabel y podemos usarlo luego
    ej: 
        cy.get('@emailLabel').then(label => {
            cy.log(label)
        })
    
    importante: los alias no se pueden guardar en una variable. 
    por lo que siempre tenemos que recuperarlo asi: cy.get('@emailLabel')
    */

    //3. invocar valor de un atributo
    cy.get('#exampleInputEmail1').invoke('attr', 'class').then(classValue => {  //attr --> mira el elemento, no su estado dinamico
        console.log(classValue);
    })
    cy.get('#exampleInputEmail1').invoke('attr', 'placeholder').then(placeholderValue => {
        console.log(placeholderValue);
    })
    cy.get('#exampleInputEmail1').should('have.attr', 'class', 'input-full-width size-medium status-basic shape-rectangle nb-transition');  //verifica que el elemento tenga exactamente ese atributo class con ese valor

    //4. invocar el valor de un campo de entrada
    cy.get('#exampleInputEmail1').type('hello@test.com');   //type() --> simula que un usuario escribe texto en ese input. ej: <input id="exampleInputEmail1" value="hello@test.com">
    cy.get('#exampleInputEmail1').invoke('prop', 'value').then (value => {  //busca la propiedad -actual- del elemento
        console.log(value);
    });    
});


it('Assertions', () => {
    /*
    -should() --> assertions automáticas: internamente espera y reintenta (afirmacion parcial)
    -expect() --> assertions manuales instantánea sobre datos JS: internamente no hace nada, solo evalúa en el momento
                    pueden ser llamado solo dentro de bloques.
    */

    /*
    cy.get('[for="exampleInputEmail1"]').should('contain', 'Email address'); 

    cy.get('[for="exampleInputEmail1"]').then(label => {
        expect(label).to.contain('Email address')
    });
    */

    cy.get('[for="exampleInputEmail1"]').should('have.text', 'Email address');  //comprueba si el elemento contiene 'Email address'

    cy.get('[for="exampleInputEmail1"]').then(label => {
        expect(label).to.have.text('Email address')
    });


    cy.get('[for="exampleInputEmail1"]').invoke('text').then( emailLabel => {
        expect(emailLabel).to.equal('Email address')    //valida si este es el texto que estamos buscando
        cy.wrap(emailLabel).should('equal', 'Email address')
    })
});


it.only('Timeouts', () => {
    /*
    tiempo por desfecto: 4 segundos (4000 milisegundos)

    configuración general:
    en archivo "cypress.config.js" --> escribir: defaultCommandTimeout:  11000

    configuración individual:
    agregarlo en metodo (get) --> {timeout:11000} equivale a 11 seg
    */


    cy.contains('Modal & Overlays').click();
    cy.contains('Dialog').click();

    cy.contains('Open with delay 3 seconds').click();
    cy.get('nb-dialog-container nb-card-header').should('have.text', 'Friendly reminder');

    //cy.contains('Open with delay 10 seconds').click();
    //cy.get('nb-dialog-container nb-card-header', {timeout:11000}).should('have.text', 'Friendly reminder');

})
