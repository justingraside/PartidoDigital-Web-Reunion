var second = 1000,
    minute = second * 60,
    hour = minute * 60,
    day = hour * 24,
    hoy = new Date(),
    diaReunion = 3,
    horaReunion = { h: 19, m: 0 };

var meses = [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
    "Agosto", "Septiembre", "Octubre", "Noviembre", "Septiembre" ];
var dias = [ "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo" ];

function nextDay(d, x){
    var now = new Date(d.getTime());
    now.setHours(horaReunion.h, horaReunion.m, 0, 0);
    now.setDate(now.getDate() + (x+(7-now.getDay())) % 7);
    now.setTime(now.getTime() + now.getTimezoneOffset() * 60 * 1000 /* convert to UTC */ - (/* UTC-3 */ 3) * 60 * 60 * 1000);
    return now;
}

var proxReunion,
    proxMartes = nextDay(hoy, diaReunion);
if(proxMartes.getDate() === hoy.getDate() && proxMartes.getMonth() === hoy.getMonth()) {
    // Hoy es Martes
    if(hoy.getHours() <= horaReunion.h) {
        proxReunion = proxMartes;
    } else {
        proxMartes.setDate(proxMartes.getDate() + 1);
        proxReunion = nextDay(proxMartes, diaReunion);
    }
} else {
    proxReunion = proxMartes;
}

document.getElementById('description').innerHTML = "<i>" + dias[proxReunion.getDay() - 1] + " "
    + proxReunion.getDate() + " de " + meses[proxReunion.getMonth()] + ", " + horaReunion.h + ":"+ ("0" + horaReunion.m).slice(-2) +" hs.</i>";

var countDown = proxReunion.getTime(),
x = setInterval(function () {
    var now = new Date().getTime(),
        distance = countDown - now;

    var dias = Math.floor(distance / (day));
    document.getElementById('dias').innerText = ("0" + dias).slice(-2);
    var horas = Math.floor((distance % (day)) / (hour));
    document.getElementById('horas').innerText = ("0" + horas).slice(-2);
    var mins = Math.floor((distance % (hour)) / (minute));
    document.getElementById('minutos').innerText = ("0" + mins).slice(-2);
    var segs = Math.floor((distance % (minute)) / second);
    document.getElementById('segundos').innerText = ("0" + segs).slice(-2);

    if (distance <= 0 || document.stopTimer === true) {
        clearInterval(x);
        document.getElementById('timerWrapper').outerHTML = "<a href='https://meet.jit.si/PartidoDigital'>¡Entrar a la reunión digital!</a>";
    }
}, second);
