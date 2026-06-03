// permite intellisense dentro del codigo, permitiendo escribir CI y llama dif metodos de Cypress
/// <reference types="cypress" />

beforeEach("Open application", () => {
    cy.visit("/")   //solo el slash porque ya definimos la url en cypress.config.js
})


it('input fields', () => {
    /*
    cy.contains('Forms').click();
    cy.contains('Form Layouts').click();

    const name = 'Johana';
    cy.get('#inputEmail1').type('example@test.com', {delay: 200}).clear().type('aaaaaxx').clear();
    cy.contains('nb-card', 'Using the Grid').contains('Email').type('Yes It Works')//.clear();      //el clear no anda acá
    cy.get('#inputEmail1').clear();
    cy.contains('nb-card', 'Using the Grid').contains('Email').type(`${name}@test.com`);

    cy.get('#inputEmail1').should('have.value', `${name}@test.com`).clear().type('johanalauk@test.com');
    cy.get('#inputEmail1').should('not.have.value', '').clear().type('jel@test.com').clear();
    cy.get('#inputEmail1').should('have.value', '').clear().type('johana.e.lauk@test.com');
    */


    cy.contains('Auth').click();
    cy.contains('Login').click();

    cy.get('#input-email').type('example@test.com').press(Cypress.Keyboard.Keys.TAB).press(Cypress.Keyboard.Keys.TAB);
    cy.get('#input-password').type('1234{enter}', {delay: 300});

   
    // COMBINACIONES DE TECLAS
    //cy.get('#input-email').type('{shift+alt+b}example'); //se presionan las 3 teclas mantenidas, antes de tipear hello
    //cy.get('#input-email').type('{ctrl}{v}hello');   //se presiona 1 tecla a la vez
    //la unica tecla que no anda es el tab
    //pero tenemos la opcion de esta sentencia --> .press(Cypress.Keyboard.Keys.TAB)

    /*
    // aca pruebo tomar el valor ingresado y mostrarlo en consola
    cy.get('#input-password').type('1234').invoke('prop', 'value').then( value => {
        console.log(value)
    });
    */
})


it('Radio buttons', () => {
    cy.contains('Forms').click();
    cy.contains('Form Layouts').click();
   
    cy.contains('nb-card', 'Using the Grid').find('[type="radio"]').then (allRadioButtons => {
        cy.wrap(allRadioButtons).eq(0).check({force:true}).should('be.checked') //si no está activo, lo forzamos para que sí
        cy.wrap(allRadioButtons).eq(1).check({force:true})
        cy.wrap(allRadioButtons).eq(0).should('not.be.checked')     //al activar el 2do rb, verificamos que el 1ero se haya desactivado
        cy.wrap(allRadioButtons).eq(2).should('be.disabled')       //verificamos que el 3ero esté deshabilitado
    });
   
    //cy.contains('nb-card', 'Using the Grid').contains('Option 1').click({force:true});    
    //cy.contains('nb-card', 'Using the Grid').contains('label','Option 1').find('input').check({force:false});
})


it('Checkbox', () => {
    cy.contains('Modal & Overlays').click();
    cy.contains('Toastr').click();
   
    //cy.get('[type="checkbox"]').check({force:true});    //se activan los 3 checkbox
    //cy.get('[type="checkbox"]').click({force:true, multiple:true});

    cy.get('[type="checkbox"]').check({force:true});
    cy.get('[type="checkbox"]').should('be.checked');
})


it('Lists and Dropdowns', () => {
    cy.contains('Modal & Overlays').click();
    cy.contains('Toastr').click();
   
    //campo desplegable nativo
    // tiene etiqueta "select" entonces se puede seleccionar el valor del desplegable sin expandirlo, luego se valida el valor del campo
    cy.contains('div', 'Toast type:').find('select').select('info').should('have.value', 'info');


    //campo desplegable custimizado
    // se tiene que hacer click en el desplegable para expandirlo, seleccionar el valor y luego contraerlo, luego se valida como texto normal (porque no son valores realmento, son textos de HTML)
    cy.contains('div', 'Position:').find('nb-select').click();
    cy.get('.option-list').contains('bottom-right').click();
    cy.contains('div', 'Position:').find('nb-select').should('have.text', 'bottom-right');


    /*
    // opcion 1, queda abierto el desplegable
    cy.contains('div', 'Position:').find('nb-select').then(dropdown => {
        cy.wrap(dropdown).click()
        cy.get('.option-list nb-option').each(option => {
            cy.wrap(option).click()
            cy.wrap(dropdown).click()
        })
    });
    */


    // opction 2, se selecciona el valor y el desplegable no queda abierto
    cy.contains('div', 'Position:').find('nb-select').then(dropdown => {
        cy.wrap(dropdown).click()
        cy.get('.option-list nb-option').each((option, index, list) => {    //each() metodo que te permite hacer un loop con la lista de elementos
            cy.wrap(option).click()     //abre el desplegable
            if (index < list.length-1)  //Si todavía no llegó a la última opción, vuelve a hacer click en el dropdown para abrirlo otra vez. Ya que al elegir, se cierra
                cy.wrap(dropdown).click()
        })
    });
})


it('Tooltips', () => {
    cy.contains('Modal & Overlays').click();
    cy.contains('Tooltip').click();
   
    cy.contains('button', 'Top').trigger('mouseenter');
    cy.get('nb-tooltip').should('have.text', 'This is a tooltip');
});


it('Dialog Boxes', () => {
    cy.contains('Tables & Data').click();
    cy.contains('Smart Table').click();

    //Opcion 1
    /*
    cy.get('.nb-trash').first().click();    //elimina el primer elemento de la tabla
    cy.on('window:confirm', confirm => {    //ventana de confirmación
        expect(confirm).to.equal('Are you sure you want to delete?');
    })
    */

    //Opcion 2
    cy.window().then(win => {
        cy.stub(win, 'confirm').as('dialogBox').returns(false);  //true=confirm | false=cancel
    })
    cy.get('.nb-trash').first().click();
    cy.get('@dialogBox').should('be.calledWith', 'Are you sure you want to delete?');
})


it('Web tables', () => {
    cy.contains('Tables & Data').click();
    cy.contains('Smart Table').click();

    //opcion 1: buscar por texto
    /*encontrar una fila en la tabla, fila con valor unico
        Busca dentro del <tbody> una fila <tr> que contenga el texto "Larry".
        Esa fila se guarda en la variable tableRow.
        En otras palabras: “dame la fila donde está Larry”.
    */
    /*
    cy.get('tbody').contains('tr','Larry').then(tableRow => {   //encontramos la fila por un valor unico, en este caso "Larry"
        cy.wrap(tableRow).find('.nb-edit').click();     //busca dentro de la fila el ícono/botón con clase .nb-edit y le hace click para editar la fila.
        cy.wrap(tableRow).find('[placeholder="Age"]').clear().type('35');   //En campo "Age" - limpiamos - escribimos "35"
        cy.wrap(tableRow).find('.nb-checkmark').click();    //busca dentro de la fila el ícono de confirmación (checkmark) y hace click para guardar el cambio
        cy.wrap(tableRow).find('td').last().should('have.text', '35');  //busca todas las celdas <td> de esa fila, toma la última, y valida que tenga 35
    });
    */


    //opcion 2: buscar por index
    //  como encontrar comp sin tener un ID o texto unico
    /*
    cy.get('.nb-plus').click();
    cy.get('thead tr').eq(2).then(tableRow => {
        cy.wrap(tableRow).find('[placeholder="First Name"]').type('Johana');
        cy.wrap(tableRow).find('[placeholder="Last Name"]').type('Lauk');
        cy.wrap(tableRow).find('.nb-checkmark').click();
    });
    cy.get('tbody tr').first().find('td').then(tableColumns => {
        cy.wrap(tableColumns).eq(2).should('have.text', 'Johana');
        cy.wrap(tableColumns).eq(3).should('have.text', 'Lauk');
    });
    */


    //opcion 3: looping a traves de filas
    const ages = [20,30,40,200];

    cy.wrap(ages).each( age => {
        cy.get('[placeholder="Age"]').clear().type(age);
        //cy.get('[placeholder="Age"]').type(20);
        cy.wait(500);   //no es buena practica
        cy.get('tbody tr').each( tableRows => {     //obtiene todas las filas
            //cy.wrap(tableRows).find('td').last().should('have.text', age);

            if (age==200) {
                cy.wrap(tableRows).should('contain.text', 'No data found');
            }
            else {
                cy.wrap(tableRows).find('td').last().should('have.text', age);
            }
        })
    })
})


it('Datepickers', () => {
    cy.contains('Forms').click();
    cy.contains('Datepicker').click();

    /*
    // 1 forma: buscar una fecha en especifica
    cy.get('[placeholder="Form Picker"]').then(inputPicker => {
        cy.wrap(inputPicker).click()    //expande   
        cy.get('.day-cell').not('.bounding-month').contains('21').click();  //.day-cell -> 42 celdas - not('.bounding-month') -> excluimos el mes
        cy.wrap(inputPicker).should('have.value', 'May 21, 2026');
    });
    */

    // 2 forma:
    /*
    let date = new Date();
    date.setDate(date.getDate() + 5);
    let futureDay = date.getDate();
    let dateToAssert = `May ${futureDay}, 2026`;    //fecha con formato: 'May 27, 2026'

    cy.get('[placeholder="Form Picker"]').then(inputPicker => {
        cy.wrap(inputPicker).click();
        cy.get('.day-cell').not('.bounding-month').contains(futureDay).click();    
        //cy.wrap(inputPicker).should('have.value', 'May 27, 2026');
        cy.wrap(inputPicker).should('have.value', dateToAssert);    //variable ya con el formato
    })
    */


    // 3 forma: hoy es 24-05-26. +35 dias --> Jun 28, 2026. Si pongo +dias que superan junio, da error. Por eso ver forma 4
    /*
    let date = new Date();
    date.setDate(date.getDate() + 35);
    let futureDay = date.getDate();
    let futureMonthLong = date.toLocaleDateString('en-US', { month: 'long'});
    let futureMonthShort = date.toLocaleDateString('en-US', { month: 'short'});
    let futureYear = date.getFullYear();
    let dateToAssert = `${futureMonthShort} ${futureDay}, ${futureYear}`;    //fecha con formato

    cy.get('[placeholder="Form Picker"]').then(inputPicker => {
        cy.wrap(inputPicker).click();

        cy.get('nb-calendar-view-mode').invoke('text').then(calendarMonthAndYear => {
            if (!calendarMonthAndYear.includes(futureMonthLong) || !calendarMonthAndYear.includes(futureYear)) 
            {
                cy.get('[data-name="chevron-right"]').click();
            }
        });

        cy.get('.day-cell').not('.bounding-month').contains(futureDay).click();    
        cy.wrap(inputPicker).should('have.value', dateToAssert);    //variable ya con el formato
    })
    */


    // 4 forma: busca fecha a futuro largo, es decir, varios click para cambio de mes, de forma reiterativa
    /*
    let date = new Date();
    date.setDate(date.getDate() + 455);
    let futureDay = date.getDate();
    let futureMonthLong = date.toLocaleDateString('en-US', { month: 'long'});
    let futureMonthShort = date.toLocaleDateString('en-US', { month: 'short'});
    let futureYear = date.getFullYear();
    let dateToAssert = `${futureMonthShort} ${futureDay}, ${futureYear}`;    //fecha con formato

    function selectDateFromCurrentDay() {
        cy.get('nb-calendar-view-mode').invoke('text').then(calendarMonthAndYear => {
            if (!calendarMonthAndYear.includes(futureMonthLong) || !calendarMonthAndYear.includes(futureYear)) 
            {
                cy.get('[data-name="chevron-right"]').click();
                selectDateFromCurrentDay();
            }
            else
            {
                cy.get('.day-cell').not('.bounding-month').contains(futureDay).click(); 
            }
        });
    }

    cy.get('[placeholder="Form Picker"]').then(inputPicker => {
        cy.wrap(inputPicker).click();
        selectDateFromCurrentDay();    
        cy.wrap(inputPicker).should('have.value', dateToAssert);    //variable ya con el formato
    })
    */


    // 4 forma REFACTORIZADA
    function selectDateFromCurrentDay(day) {
        let date = new Date();
        date.setDate(date.getDate() + day);
        let futureDay = date.getDate();
        let futureMonthLong = date.toLocaleDateString('en-US', { month: 'long'});
        let futureMonthShort = date.toLocaleDateString('en-US', { month: 'short'});
        let futureYear = date.getFullYear();
        let dateToAssert = `${futureMonthShort} ${futureDay}, ${futureYear}`;    //fecha con formato
        
        cy.get('nb-calendar-view-mode').invoke('text').then(calendarMonthAndYear => {
            //si aun no estamos en el mes o año indicado, hacer click para avanzar
            if (!calendarMonthAndYear.includes(futureMonthLong) || !calendarMonthAndYear.includes(futureYear)) {
                cy.get('[data-name="chevron-right"]').click();
                selectDateFromCurrentDay(day);  //recursividad, para que repita hasta que se cumpla la condicion
            }
            else {
                cy.get('.day-cell').not('.bounding-month').contains(futureDay).click(); 
            }
        });
        return dateToAssert;
    }

    cy.get('[placeholder="Form Picker"]').then(inputPicker => {
        cy.wrap(inputPicker).click();
        const dateToAssert = selectDateFromCurrentDay(10);    
        cy.wrap(inputPicker).should('have.value', dateToAssert);    //variable ya con el formato
    })
})


it('Sliders', () => {
    cy.get('[tabtitle="Temperature"] circle')   //tiene 2 atributos porque es circular, si fuera lineal probablemente sea 1
        .invoke('attr', 'cx', '38.66')  //atributo eje X
        .invoke('attr', 'cy', '57.75')  //atributo eje y
        .click();
    cy.get('[class="value temperature h1"]').should('contain.text', '18');
})


it('Drag & Drop', () => {
    cy.contains('Extra Components').click();
    cy.contains('Drag & Drop').click();

    cy.get('#todo-list div').first().trigger('dragstart');  //encontras el primer elemento
    cy.get('#drop-list').trigger('drop');   //este es el proceso que mueve
})


it.only('iFrames', () => {
    cy.contains('Modal & Overlays').click();
    cy.contains('Dialog').click();

    /*
    seguir la config --> https://www.npmjs.com/package/cypress-iframe
    cypress no tiene soporte nativo para los iframes, por lo que hay que instalar el plugin para habilitar la funcionalidad.
    escribir en la terminal:
        npm i cypress-iframe --save-dev
    */

    cy.frameLoaded('[data-cy="esc-close-iframe"]');     //cargar el marco para luego usarlo y localizar los elementos

    //forma 1
    //cy.iframe('[data-cy="esc-close-iframe"]').contains('Open Dialog with esc close').click();     //aca se localiza el elemento
    //cy.contains('Dismiss Dialog').click();

    //forma 2
    cy.enter('[data-cy="esc-close-iframe"]').then( getBody => {
        getBody().contains('Open Dialog with esc close').click();
        cy.contains('Dismiss Dialog').click();
        getBody().contains('Open Dialog without esc close').click();
        cy.contains('OK').click();
    });
})

