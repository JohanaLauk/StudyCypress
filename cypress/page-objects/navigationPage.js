/*
cuando quieras crear un nuevo objeto de pagina, simplemente crea una nueva clase para cada pagina de tu app.
A veces puede tener una excepción para las áreas que se muestran en la pantalla todo el tiempo.
Tambien puede crear los objetos de pagina para ello.
Y en general, no hay reglas rigidas en el patron de diseño de objetos de pagina cuando se tiene que crear la pagina.
Si necesitas crear un nuevo tipo de capa de abstracción o una nueva pagina para alguna funcionalidad repetitiva, hagalo.

crea la nueva clase
exportas la instancia de la clase dentro de la misma clase para no tener que hacerlo cada vez en los archivos de prueba 
luego en el nivel de archivo de prueba, llamar a la instancia y luego llamar sus metodos
*/

class NavigationPage {

    formLayoutsPage() {
        selectGroupMenuItem('Forms');
        //cy.contains('Forms').click(); //quitar por usar la linea anterior
        cy.contains('Form Layouts').click();
    }

    datePickerPage() {
        selectGroupMenuItem('Forms');
        //cy.wait(200);   //rompe
        cy.contains('Datepicker').click();
    }

    toastsPage() {
        selectGroupMenuItem('Modal & Overlays');
        cy.contains('Toastr').click();
    }

    tooltipPage() {
        selectGroupMenuItem('Modal & Overlays');
        cy.contains('Tooltip').click();
    }

}

function selectGroupMenuItem(gmItemName)
{
    cy.contains('a', gmItemName).invoke('attr', 'aria-expanded').then(attr => {
        if (attr.includes('false')) {
            cy.contains('a', gmItemName).click();
        }
    });
}

export const navigateTo = new NavigationPage();