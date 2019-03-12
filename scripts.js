var second = 1000,
    minute = second * 60,
    hour = minute * 60,
    day = hour * 24,
    hoy = new Date(),
    diaReunion = 3,
    horaReunion = { h: 20, m: 00 };

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
        document.getElementById('timerWrapper').outerHTML = '<form id="registro_web" class="py-4"><div class="input-group"><input type="text" class="form-control" name="nombre" placeholder="Nombre" style="border-radius: 5px 0 0 0 !important;"><input type="text" name="apellido" style="border-radius: 0 5px 0 0 !important;" class="form-control" placeholder="Apellido"></div><input type="email" placeholder="Correo electrónico" name="email" class="required email" required=""><button id="enviar_info">Entrar a la reunión digital</button>';
        document.getElementById('enviar_info').addEventListener('click', function() {
            $.ajax({
              method: "post",
              url: "https://info.partidodigital.org.uy/form/submit?formId=8&ajax=true",
              headers: { 'X-Requested-With': 'XMLHttpRequest' },
              dataType: "json",
              data: $.param({
                "mauticform[nombre]": $("[name=nombre]").val(),
                "mauticform[apellido]": $("[name=apellido]").val(),
                "mauticform[email]": $("[name=email]").val(),
                "mauticform[submit]": 1,
                "mauticform[formId]": 8,
                "mauticform[formName]": "reunion",
                "mauticform[return]": ""
              }),
              beforeSend: function () {
                if (
                  $("[name=nombre]").val() === "" ||
                  $("[name=apellido]").val() === "" ||
                  $("[name=email]").val() === "") {
                  $("#enviar_info")
                    .attr("disabled", true)
                    .addClass("error")
                    .html("Algún campo está vacío. Intentalo de nuevo.");
                  setTimeout(function () {
                    $("#enviar_info")
                      .attr("disabled", false)
                      .removeClass("error")
                      .html("Entrar a la reunión digital");
                  }, 5000);
                  return false;
                }
                $("#enviar_info")
                  .attr("disabled", true)
                  .html("Enviando...");
              },
              success: function () {
                $("#enviar_info")
                  .attr("disabled", true)
                  .html("Datos enviados. Entrando a la reunión...");
                setTimeout(function () {
                  document.location.href = "https://meet.jit.si/PartidoDigital";
                }, 2000);
              },
              error: function (jqXHR, textStatus, errorThrown) {
                $("#enviar_info")
                  .attr("disabled", true)
                  .html("Hubo un error. Prueba de nuevo.");
                setTimeout(function () {
                  $("#enviar_info")
                    .attr("disabled", false)
                    .html("Entrar a la reunión digital");
                }, 5000);
              }
            });
          });
    }
}, second);
