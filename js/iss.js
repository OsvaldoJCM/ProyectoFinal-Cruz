window.addEventListener("load", () => {

    document.getElementById('iss').style.display = 'none';

    document.getElementById('tablaAvistamientos').style.display = 'none';
});

const DateTime = luxon.DateTime;
let mensaje = document.getElementById("mensaje");

function saberMas() {
    fetch(`https://api.wheretheiss.at/v1/satellites/25544`)
        .then((resp) => resp.json())
        .then((data) => {
            document.getElementById('codigo').innerHTML = "Codigo    : " + data.name;
            document.getElementById('numero').innerHTML = "Numero    : " + data.id;
            document.getElementById('latitud').innerHTML = "Latitud   : " + data.latitude;
            document.getElementById('longitud').innerHTML = "Longitud  : " + data.longitude;
            document.getElementById('velocidad').innerHTML = "Velocidad : " + Math.round(data.velocity) + " Km/h";
            document.getElementById('altura').innerHTML = "Altura    : " + Math.round(data.altitude) + " Km";
        })

    let divIss = document.getElementById('iss');
    setTimeout(() => {
        document.getElementById('sabiasQueInfo').style.display = 'none';
        divIss.style.backgroundImage = 'url(img/ISS.webp)';
        divIss.style.backgroundSize = "cover";
        divIss.style.opacity = 0.9;
        divIss.style.display = 'block';
    }, 250);

}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(mostrarPosicion);
    } else {
        mensaje.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function mostrarPosicion(position) {
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    // Coneion a api 
    fetch(`https://tle.ivanstanojevic.me/api/tle/25544/flyover?latitude=${lat}&longitude=${long}`)
        .then((resp) => resp.json())
        .then((data) => {
            mostrarAproximaciones(data)
        })
}

function mostrarAproximaciones(data) {
    if (data.member && Array.isArray(data.member)) {
        setTimeout(() => {
            // Iteramos sobre cada elemento del array 'member'
            data.member.forEach(member => {

                let memberId = member["@id"];
                let memberType = member["@type"];

                let formatear = (numero, tipo) => {
                    if (tipo == "fecha") {
                        return DateTime.fromISO(`${numero}`).toFormat('f')
                    } else {
                        return DateTime.fromISO(`${numero}`).toFormat('t')
                    }
                }

                let puntoCardinal = (numero) => {
                    let val = Math.floor((numero / 22.5) + 0.5);
                    let arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
                    return `${Math.round(numero)}º ${arr[(val % 16)]}`;
                }

                // AOS - Acquisition of Signal (or Satellite) //Momento en el que un objeto emerge en el horizonte de un observador
                let aosDate = formatear(member.aos.date, 'fecha');
                let aosAzimuth = puntoCardinal(member.aos.azimuth);
                let aosElevation = member.aos.elevation;

                // MAX & TCA - Time of Closest Approach //Momento en el que esta más cerca de observador o Elevación MAXIMA sobre el horizonte. 
                let maxDate = formatear(member.max.date, 'hora');
                let maxAzimuth = puntoCardinal(member.max.azimuth);
                let maxElevation = member.max.elevation;

                // LOS - Loss of Signal (or Satellite). //Momento en el que un objeto se pierde bajo el horizonte de un observador
                let losDate = formatear(member.los.date, 'hora');;
                let losAzimuth = puntoCardinal(member.los.azimuth);
                let losElevation = member.los.elevation;


                let tr = document.createElement("tr")
                let td = document.createElement("td");

                let fila = "<tr>";

                //AOS
                fila += `<td>${aosDate}</td>`;
                fila += `<td>${aosAzimuth}</td>`;
                // MAX
                fila += `<td>${maxDate}</td>`;
                fila += `<td>${maxAzimuth}º</td>`;
                fila += `<td>${maxElevation}º</td>`;

                // LOS
                fila += `<td>${losDate}</td>`;
                fila += `<td>${losAzimuth}</td>`;

                fila += "</tr>";
                document.getElementById("avistamientos").innerHTML += fila
            });
        }, 0);
        document.getElementById('tablaAvistamientos').style.display = 'block';
    } else {
        mensaje.innerHTML = "No se encontró la propiedad 'member' o no es un array.";
    }
}

