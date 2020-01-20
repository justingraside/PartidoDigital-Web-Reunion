const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '../_site/index.html'), 'utf8');

jest
    .dontMock('fs');

describe('botones', function () {
    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
    });

    afterEach(() => {
        // restore the original func after test
        jest.resetModules();
    });

    it('botones presentes', function () {
        expect(document.getElementById('voluntario')).toBeTruthy();
        expect(document.getElementById('dona')).toBeTruthy();
        expect(document.getElementById('afiliate')).toBeTruthy();
    });
});

describe('calcProxDia', function() {
    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
    });

    afterEach(() => {
        // restore the original func after test
        jest.resetModules();
    });

    it('calcula el proximo día para cada día de la semana', function () {
        const {calcProxDia} = require('../_site//src/main.js');
        expect(calcProxDia(new Date("Jan 19 2020 20:00:00 GMT-0300"), "Lunes", { h: 21, m: 0}).getTime())
            .toBe(new Date("Jan 20 2020 21:00:00 GMT-0300").getTime());
        expect(calcProxDia(new Date("Jan 20 2020 20:00:00 GMT-0300"), "Martes", { h: 21, m: 0}).getTime())
            .toBe(new Date("Jan 21 2020 21:00:00 GMT-0300").getTime());
        expect(calcProxDia(new Date("Jan 21 2020 20:00:00 GMT-0300"), "Miércoles", { h: 21, m: 0}).getTime())
            .toBe(new Date("Jan 22 2020 21:00:00 GMT-0300").getTime());
        expect(calcProxDia(new Date("Jan 22 2020 20:00:00 GMT-0300"), "Jueves", { h: 21, m: 0}).getTime())
            .toBe(new Date("Jan 23 2020 21:00:00 GMT-0300").getTime());
        expect(calcProxDia(new Date("Jan 23 2020 20:00:00 GMT-0300"), "Viernes", { h: 21, m: 0}).getTime())
            .toBe(new Date("Jan 24 2020 21:00:00 GMT-0300").getTime());
        expect(calcProxDia(new Date("Jan 24 2020 20:00:00 GMT-0300"), "Sábado", { h: 21, m: 0}).getTime())
            .toBe(new Date("Jan 25 2020 21:00:00 GMT-0300").getTime());
        expect(calcProxDia(new Date("Jan 25 2020 20:00:00 GMT-0300"), "Domingo", { h: 21, m: 0}).getTime())
            .toBe(new Date("Jan 26 2020 21:00:00 GMT-0300").getTime());
    });
});