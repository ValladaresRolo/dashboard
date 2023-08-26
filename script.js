import { fetchApi } from "./fetch.js";


//funcion jquery para el datapicker
$(function () {

    $('.input-daterange input').each(function () {
        $(this).datepicker({
            language: 'es',

        });
    });

});

let valoresUf = []; // arreglo para guardar los datos
let fechas = [];
let myChart = null; // tiene que ser global esta para reemplazr
let date = null;



// esto es para el color
const rgbaRedColor = 'rgba(255, 99, 132, 0.2)';
const rgbRedColor = 'rgb(255, 99, 132)';

const rgbaOrangeColor = 'rgba(255, 159, 64, 0.2)';
const rgbOrangeColor = 'rgb(255, 159, 64)';

// valor desde el formulario
const form = document.querySelector("form");
const afpSelect = document.querySelector("#afp");
const fondoSelect = document.querySelector("#fondo");
const button = document.querySelector("#boton");
const dateIn = document.querySelector("#dateIn");
const dateOut = document.querySelector("#dateOut");



//funcion consulta y crea el chart
async function renderData(afp, fondo, inDate, outDate) {

    console.log(afp, fondo, inDate, outDate);
    const urlApi = (`https://www.quetalmiafp.cl/api/Cuota/ObtenerCuotas?listaAFPs=${afp}&listaFondos=${fondo}&fechaInicial=${inDate}&fechaFinal=${outDate}`);
    const valoresCuota = await fetchApi(urlApi);


    console.log(urlApi);

    //.then(data => console.log(data)) // pa saber si la data llega
    valoresUf = valoresCuota.map(valorCuota => valorCuota.valorUf) // .map itera todo el arreglo y devuelve un arreglo nuevo
    fechas = valoresCuota.map(valorCuota => valorCuota.fecha)// .map itera todo el arreglo y devuelve un arreglo nuevo

    const backgroundColors = valoresUf.map(valorUf => valorUf > 3 ? rgbaRedColor : rgbaOrangeColor)  // aca doy instruccion de color 
    const borderColors = valoresUf.map(valorUf => valorUf > 3 ? rgbRedColor : rgbOrangeColor)  // aca doy instruccion de color 

    console.log('valoresUf: ', valoresUf); // compruebo los datos
    console.log('fechas: ', fechas) // compruebo los datos


    // saber maximo y minimo valor cuota

    let ufValores = valoresUf;
    let max = Math.max(...ufValores);
    let min = Math.min(...ufValores);
    //operador de propagación (...) para pasar todos los elementos del array
    console.log("Máximo:", max);
    console.log("Mínimo:", min);




    // Obtienes el contexto del canvas
    const ctx = document.getElementById('myChart');

    if (myChart) {
        myChart.destroy();
    }//esto es para destuir el chart

    // Luego creas la nueva gráfica con el mismo canvas y guardas la instancia en la variable solo si es null
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: fechas,
            datasets: [{
                label: 'Valor cuota',
                data: valoresUf,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false,
                    suggestedMin: max,
                    suggestedMax: min
                }
            },

            // modifica el tooltip
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let label = context.dataset.label || '';

                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y + 'UF';  // modifeica el texto renderisado
                            }
                            return label;
                        }
                    }
                }
            }

        }
    });
}
//renderData();

// funcion cambia formato fecha
function formatDate(date) {
    return encodeURIComponent(date);
}
/* /*/

button.addEventListener("click", (event) => {
    event.preventDefault();

    const afp = afpSelect.value;
    const fondo = fondoSelect.value;
    let inDate = formatDate(dateIn.value);
    let outDate = formatDate(dateOut.value);


    /*
     console.log(inDate); // Output: 
 
    
     console.log(outDate); // Output: 
 
 
     console.log(afp, fondo, inDate, outDate);
 
 */

    renderData(afp, fondo, inDate, outDate);
});