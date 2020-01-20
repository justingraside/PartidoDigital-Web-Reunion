---
---

Sentry.init({ dsn: 'https://1a981ffa3c0d4cdfa0e915621fe1f7cb@sentry.io/1887605' });
    
var meses = [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
    "Agosto", "Septiembre", "Octubre", "Noviembre", "Septiembre" ];
var dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado" ];

function bindFormulario(accionBoton) {
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
              .html(accionBoton.default);
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
          .html(accionBoton.success);
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
            .html(accionBoton.default);
        }, 5000);
      }
    });
  });
}

function addFormulario(accionBoton) {
  // Cargando template de _includes/formulario_entrar.html: {% include formulario_entrar.html %}
  document.getElementById('timerWrapper').outerHTML = '{{ formulario_entrar | strip_newlines }}';
  document.getElementById('enviar_info').innerHTML = accionBoton.default;
  bindFormulario(accionBoton);
}

function calcProxDia(d, dia, horaReunion){
  var x = dias.indexOf(dia);
  var now = new Date(d.getTime());
  now.setHours(horaReunion.h, horaReunion.m, 0, 0);
  now.setDate(now.getDate() + (x+(7-now.getDay())) % 7);
  now.setTime(now.getTime() + now.getTimezoneOffset() * 60 * 1000 /* convert to UTC */ - (/* UTC-3 */ 3) * 60 * 60 * 1000);
  return now;
}

var second = 1000,
    minute = second * 60,
    hour = minute * 60,
    day = hour * 24,
    hoy = new Date(),
    duracionReunion = {{ site.duracion }},
    urlReunion = "{{ site.link }}",
    fechaReunion = new Date("{{ site.fecha }}"),
    reunionHabilitada = "{{ site.habilitado }}",
    accionBoton = {default: "Entrar a la reunión digital", success: "Datos enviados. Entrando a la reunión..."};

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

function definirProxReunion(reunionHabilitada, proxDia) {
  if(reunionHabilitada === "recurrente") {
    if(proxDia.getFullYear() == hoy.getFullYear() && proxDia.getMonth() === hoy.getMonth() && proxDia.getDate() === hoy.getDate()) {
        if(hoy.getTime() <= proxDia.getTime() + duracionReunion * 60000) {
            return proxDia;
        } else {
            proxDia.setDate(proxDia.getDate() + 1);
            return calcProxDia(proxDia, diaReunion);
        }
    } else {
        return proxDia;
    }
    if(fechaReunion.getFullYear() >= hoy.getFullYear()) {
      if(fechaReunion.getMonth() > hoy.getMonth()) {
        return fechaReunion;
      } else if(fechaReunion.getMonth() == hoy.getMonth()) {
        if(fechaReunion.getDate() > hoy.getDate()) {
          return fechaReunion;
        } else if(fechaReunion.getDate() == hoy.getDate()) {
          if(hoy.getTime() <= fechaReunion.getTime() + duracionReunion * 60000) {
            return fechaReunion;
          }
        }
      }
    }
  } else if(reunionHabilitada === "fecha") {
    if(fechaReunion.getFullYear() >= hoy.getFullYear()) {
      if(fechaReunion.getMonth() > hoy.getMonth()) {
        return fechaReunion;
      } else if(fechaReunion.getMonth() == hoy.getMonth()) {
        if(fechaReunion.getDate() > hoy.getDate()) {
          return fechaReunion;
        } else if(fechaReunion.getDate() == hoy.getDate()) {
          if(hoy.getTime() <= fechaReunion.getTime() + duracionReunion * 60000) {
            return fechaReunion;
          }
        }
      }
    }
  } else if(reunionHabilitada === "off") { 
    // Cargando template de _includes/reunion_deshabilitada.html: {% include reunion_deshabilitada.html %}
    document.getElementById('info_reunion').outerHTML = '{{ reunion_deshabilitada | strip_newlines }}';
    document.getElementById('timerWrapper').outerHTML = '{{ formulario_entrar | strip_newlines }}';
    accionBoton = {default: "Recibir notificación de próxima reunión", success: "Datos enviados. ¡Gracias por tu interes!"};
    addFormulario(accionBoton);
    return null;
  }
}

function configurarReunion(proxReunion) {
  if(reunionHabilitada !== "off" && proxReunion != null) {
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
            addFormulario(accionBoton);
        }
    }, second);
  } else {
    accionBoton = {default: "Recibir notificación de próxima reunión", success: "Datos enviados. ¡Gracias por tu interes!"};
    document.getElementById("duracion-wrapper").style.display = "none";
    addFormulario(accionBoton);
  }
}

configurarReunion(definirProxReunion(reunionHabilitada, calcProxDia(hoy, "{{ site.dia }}", { 
  h: "{{ site.hora }}".split(":")[0], 
  m: "{{ site.hora }}".split(":")[1] 
  }))
);

if (typeof exports !== 'undefined') {
  module.exports = {
    calcProxDia,
    definirProxReunion,
    configurarReunion
  };
}