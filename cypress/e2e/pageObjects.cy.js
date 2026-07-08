// permite intellisense dentro del codigo, permitiendo escribir Cy y llamar a los dif metodos de Cypress
/// <reference types="cypress" />

import { onDatepickerPage } from "../page-objects/datepickerPage";
import { onFormLayoutsPage } from "../page-objects/formLayoutsPage";
import { navigateTo } from "../page-objects/navigationPage";

beforeEach("Open application", () => {
    //cy.visit("/")   //solo el slash porque ya definimos la url en cypress.config.js
    
    cy.openHomePage();
    //Limitaciones de usar comandos: este comando se vuelve invisible para intellisense --> es decir, no puedo v
    //No abuses del uso de comandos, usalo solo de forma global 
    //con la creación de support > index.d.ts --> ahora se puede acceder como el resto de las instancias --> contrl + clic
})


it('navigation test', () => {
    navigateTo.formLayoutsPage();
    navigateTo.datePickerPage();
    navigateTo.tooltipPage();
    navigateTo.toastsPage();
})


it.only('test with page object', () => {
    navigateTo.formLayoutsPage();
    onFormLayoutsPage.submitUsingTheGridForm('test@test.com', '1234', 1);
    //onFormLayoutsPage.submitUsingTheGridForm('test2@test.com', '4321', 0);
    //onFormLayoutsPage.submitBasicForm('prueba@test.com', 'abcd', true);
    
    //navigateTo.datePickerPage();
    //onDatepickerPage.selectCommonDatepickerDateFromToday(5);
    //onDatepickerPage.selectRangePickerDateFromToday(10,15);
})