var meses = [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
    "Agosto", "Septiembre", "Octubre", "Noviembre", "Septiembre" ];
var dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado" ];

var second = 1000,
    minute = second * 60,
    hour = minute * 60,
    day = hour * 24,
    hoy = new Date(),
    duracionReunion = 60,
    urlReunion = "https://us04web.zoom.us/j/4418283181",
    diaReunion = dias.indexOf("Martes"),
    fechaReunion = new Date("May 25 2019 22:00:00 GMT-0300"),
    horaReunion = { h: "20:00".split(":")[0], m: "20:00".split(":")[1] };

function calcProxDia(d, x){
    var now = new Date(d.getTime());
    now.setHours(horaReunion.h, horaReunion.m, 0, 0);
    now.setDate(now.getDate() + (x+(7-now.getDay())) % 7);
    now.setTime(now.getTime() + now.getTimezoneOffset() * 60 * 1000 /* convert to UTC */ - (/* UTC-3 */ 3) * 60 * 60 * 1000);
    return now;
}

function duracionTexto(duracion) {
  var out = "";
  if(duracion / 60 == 1) {
    out += "1 hora.";
  } else if(duracion / 60 < 1) {
      out += duracion + " minutos.";
  } else {
      if(Math.trunc(duracion / 60) > 1) {
          out += Math.trunc(duracion / 60) + " horas";
      } else {
          out += "1 hora";
      }
      if(duracion / 60 % 1 > 0) {
          out += Math.round(duracion / 60 % 1 * 60) + " minutos.";
      } else {
          out += ".";
      }
  }
  return out;
}

var proxReunion,
    proxDia = calcProxDia(hoy, diaReunion);
if(JSON.parse("false")) {
    if(proxDia.getFullYear() == hoy.getFullYear() && proxDia.getMonth() === hoy.getMonth() && proxDia.getDate() === hoy.getDate()) {
        if(hoy.getTime() <= proxDia.getTime() + duracionReunion * 60000) {
            proxReunion = proxDia;
        } else {
            proxDia.setDate(proxDia.getDate() + 1);
            proxReunion = calcProxDia(proxDia, diaReunion);
        }
    } else {
        proxReunion = proxDia;
    }
  if(fechaReunion.getFullYear() >= hoy.getFullYear() && fechaReunion.getMonth() >= hoy.getMonth() && fechaReunion.getDate() >= hoy.getDate()) {
    if(hoy.getTime() <= fechaReunion.getTime() + duracionReunion * 60000) {
      proxReunion = fechaReunion;
    }
  }
} else { 
  // Cargando template de _includes/reunion_deshabilitada.html: ✔
  document.getElementById('info_reunion').outerHTML = '<div class="p-0 my-4">    <h2 id="head" class="mb-4">No hay ninguna reunión programada.</h2>    <a href="https://partidodigital.org.uy/voluntariado" class="btn btn-primary mb-2">Sumate como Voluntario</a><br><a href="https://partidodigital.org.uy/afiliaciones" class="btn btn-secondary mr-2">Afiliate</a><a href="https://partidodigital.org.uy/donar" class="btn btn-secondary">Doná</a></div>';
}

if(JSON.parse("false")) {
  if(urlReunion.indexOf("jit.si") > 0) {
    document.getElementById("instrucciones_jitsi").style.display = "inline";
  }

  document.getElementById("duracion").innerHTML = duracionTexto(duracionReunion);

  document.getElementById('description').innerHTML = "<i>" + dias[proxReunion.getDay()] + " "
      + proxReunion.getDate() + " de " + meses[proxReunion.getMonth()] + ", " + proxReunion.getHours() + ":"+ ("0" + proxReunion.getMinutes()).slice(-2) +" hs.</i>";

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
          // Cargando template de _includes/formulario_entrar.html: ✔
          document.getElementById('timerWrapper').outerHTML = '<form id="registro_web" class="py-4">    <div class="input-group">        <input type="text" class="form-control" name="nombre" placeholder="Nombre" style="border-radius: 5px 0 0 0 !important;">        <input type="text" name="apellido" style="border-radius: 0 5px 0 0 !important;" class="form-control" placeholder="Apellido">    </div>    <input type="email" placeholder="Correo electrónico" name="email" class="required email" required="">    <button id="enviar_info">Entrar a la reunión digital</button></form>';
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
                    document.location.href = urlReunion;
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
}
