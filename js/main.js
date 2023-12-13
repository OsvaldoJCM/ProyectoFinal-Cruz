
let puntaje = 0;
let form = document.getElementById("formParticipante");
const planetas = ["Mercurio", "Venus", "Tierra", "Marte", "Júpiter", "Saturno", "Urano", "Neptuno"];
const preguntas = {
    "respuesta1": [
        "c", //respuesta correcta
        "pregunta1", //Contenedor de la pegunta
        "pregunta2", //contenedor siguiente
        "A pesar de las ilustraciones en amarillo a las que estamos acostumbrados el color del sol es blanco, de otra manera las nubes, la nieve y los osos polares serian amarillos. El motivo del por qué lo vemos amarillo es por la cantidad de gases y polvo que se acumulan en la atmósfera y dispersan la luz volviendo de ese color el sol durante el atardecer."
    ],
    "respuesta2": [
        "c",
        "pregunta2",
        "pregunta3",
        "Plutón fue considerado durante mucho tiempo el noveno planeta de nuestro sistema solar. Hasta 2006 cuando se redefinió lo que significa ser un planeta y en vista de los nuevos requisitos quedó fuera de los otros 8 con la categoría de planeta menor."
    ],
    "respuesta3": [
        "a",
        "pregunta3",
        "pregunta4",
        "Desde el 8 de junio del 2021, se reconoce al Océano Austral como el quinto océano del mundo. Conocido extraoficialmente por muchos años este oceano es el cuerpo de agua que rodea la Antártida."
    ],
    "respuesta4": [
        "b",
        "pregunta4",
        "pregunta5",
        `Después el sol el orden es : ${planetas.join(", ")}.`
    ],
    "respuesta5": [
        "b",
        "pregunta5",
        "resumen",
        "Aunque Mercurio se encuentra más cerca, Venus tiene una atmósfera compuesta por un 96% dióxido de carbono, este gas en exceso atrapa el calor que viene del sol produciendo que el planeta tenga 3 veces la temperatura de Mercurio."
    ]
}
class Persona {
    constructor(nombre, pais) {
        this.nombre = nombre;
        this.pais = pais;
    }
}
//Al cargar la pagina, ordena los contenedores y si hay datos en localStorage, muesta un mensaje indicando que ya se registro anteriormente
window.addEventListener("load", ordenarDivs());
function ordenarDivs() {
    let datosLocalStorage = JSON.parse(localStorage?.getItem("participante"));
    if (!datosLocalStorage?.nombre) {
        document.getElementById('login').setAttribute("hidden", false);
        document.getElementById('opciones').style.display = 'block';
        document.getElementById('test').style.display = 'none';
    } else {

        document.getElementById('login').setAttribute("hidden", false);
        document.querySelector("#aviso h3").innerText = `Estimado ${datosLocalStorage?.nombre}`;
        document.querySelector("#aviso p").innerText = "Según nuestros registros, ya se encuentra inscrito. ¿Desea inscribir a otra persona?"
        document.getElementById("cerrar").innerText = "Cerrar sesión e incribir a otra persona";
        document.getElementById("aviso").showModal();
        document.getElementById("cerrar").addEventListener("click", () => {
            localStorage.clear();
            document.getElementById('opciones').style.display = 'block';
        });
    }
}

// Iniciar test
function iniciar() {

    document.getElementById('info').style.display = 'none';
    document.getElementById('test').style.display = 'block';
    document.getElementById("pregunta1").style.display = 'block';
}

//Funcion que espera que sea seleccionada una alternativa  
let radio = document.getElementsByClassName("radio");
for (let i = 0; i < radio.length; i++) {
    radio[i].addEventListener("click", function (event) {
        let alternativa = event.target;
        evaluar(alternativa.value, alternativa.name);
    })
}
//funcion que recibe la alternativa y el cuál pregunta es para mostrar el mensaje de respuesta y pasar a la siguiente
function evaluar(respuesta, i) {


    if (respuesta == preguntas[i][0]) {
        puntaje += 2;
        clase = "success";
        mensaje = "Correcto!";
    } else {
        clase = "error";
        mensaje = "Incorrecto!";
    }

    document.getElementById(preguntas[i][1]).style.display = 'none';
    document.getElementById("mensaje").innerHTML = `<div role="alert" class="alert alert-${clase} py-5">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>${mensaje} <p>${preguntas[i][3]}</p></span> <div> 
        <button id="siguiente" class="btn btn-md ">Siguiente</button>
        </div></div>`;
    document.getElementById("siguiente").addEventListener("click", () => {
        document.getElementById("mensaje").innerHTML = "";
        if (preguntas[i][2] == "resumen") {
            document.getElementById(preguntas[i][2]).innerHTML = ` <h3 class="text-2xl py-5 card-title">Obtuviste ${puntaje} pts, por lo tanto tienes un ${10 * puntaje}% de descuento en la matricula </h3> <div class="form-control mt-6">
            <button class="btn glass" onclick="inscripcion()">Incribirme</button>
        </div>`;
        }
        document.getElementById(preguntas[i][2]).style.display = 'block';
    });

}

// Mostrar formulario de inscripcion
function inscripcion(params) {

    document.getElementById('login').removeAttribute("hidden");
    document.getElementById('mensajeInscripcion').innerText = `Regístrate ${10 * puntaje}% de descuento por tu participación en el test de nivelación!`;
    document.getElementById('opciones').style.display = 'none';
}

// Se espera que el fomrulario se envie para guardar los datos en localStorage
form.addEventListener("submit", (e) => {
    e.preventDefault();
    let formulario = e.target;
    let nombre = formulario.nombre.value;
    let pais = formulario.pais.value;
    const participante = new Persona(nombre, pais);
    const participanteJSON = JSON.stringify(participante);
    localStorage.setItem("participante", participanteJSON);
    document.querySelector("#aviso h3").innerText = `Estimado ${nombre}`;
    document.querySelector("#aviso p").innerText = "Gracias por tu participación, en los proximos dias nos comunicaremos con usted para hacer las gestión de la matricula"
    document.getElementById("cerrar").innerText = "Cerrar";
    document.getElementById("aviso").showModal();
    document.getElementById("cerrar").addEventListener("click", () => {
        ordenarDivs();
    });

});