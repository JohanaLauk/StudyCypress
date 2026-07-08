class DatepickerPage {

    selectCommonDatepickerDateFromToday(numberOfDaysFromToday) {
        cy.get('[placeholder="Form Picker"]').then(inputPicker => {
            cy.wrap(inputPicker).click();
            const dateToAssert = selectDateFromCurrentDay(numberOfDaysFromToday);    
            cy.wrap(inputPicker).should('have.value', dateToAssert);    //variable ya con el formato
        })
    }

    selectRangePickerDateFromToday(numberOfDaysFromTodayStart, numberOfDaysFromTodayEnd) {
        cy.get('[placeholder="Range Picker"]').then(inputPicker => {
            cy.wrap(inputPicker).click();
            const dateToAssertStart = selectDateFromCurrentDay(numberOfDaysFromTodayStart);
            const dateToAssertEnd = selectDateFromCurrentDay(numberOfDaysFromTodayEnd);
            const finalDate = `${dateToAssertStart} - ${dateToAssertEnd}`;
            cy.wrap(inputPicker).should('have.value', finalDate);    //variable ya con el formato
        })
    }
}

function selectDateFromCurrentDay(day) {

    let date = new Date();
    date.setDate(date.getDate() + day);
    let futureDay = date.getDate();
    let futureMonthLong = date.toLocaleDateString('en-US', { month: 'long'});
    let futureMonthShort = date.toLocaleDateString('en-US', { month: 'short'});
    let futureYear = date.getFullYear();
    let dateToAssert = `${futureMonthShort} ${futureDay}, ${futureYear}`;    //fecha con formato

    cy.get('nb-calendar-view-mode').invoke('text').then(calendarMonthAndYear => {
        if (!calendarMonthAndYear.includes(futureMonthLong) || !calendarMonthAndYear.includes(futureYear)) {
            cy.get('[data-name="chevron-right"]').click();
            selectDateFromCurrentDay(day);
        }
        else {
            cy.get('.day-cell').not('.bounding-month').contains(futureDay).click();    
        }
    });
    return dateToAssert;
}

export const onDatepickerPage = new DatepickerPage();