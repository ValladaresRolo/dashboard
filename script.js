import { fetchApi } from "./fetch.js";


/* obtener el dia de hoy y dar formato */
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
const formattedDate = `${day}/${month}/${year}`;

// asgno el formato de hoy a input 
const dateOutInput = document.getElementById("dateOut");
dateOutInput.value = formattedDate;


//funcion jquery para el datapicker
$(function () {

    $('.input-daterange input').each(function () {
        $(this).datepicker({
           
            language: "es",
        autoclose: true,
        startDate: "01/08/2002",
        


        });
    });

});

let valoresUf = []; // arreglo para guardar los datos
let fechas = [];
let myChart = null; // tiene que ser global esta para reemplazr
let date = null;

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
    const labelTopchart = `valor Cuota UF AFP ${afp} en Fondo ${fondo}`;
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: fechas,
            datasets: [{
                label: labelTopchart,
                data: valoresUf,
               //color del borde dependiendo del maximo y minimo
              borderColor: function (context) {
                    const value = context.dataset.data[context.dataIndex];
                    const min = Math.min(...context.dataset.data);
                    const max = Math.max(...context.dataset.data);
                    const scale = (value - min) / (max - min);
                    /*const red = 255;
                    const green = Math.round(scale * 255);
                    const blue = Math.round(scale * 255);*/
                    const red = scale * 255;
                    const green = 0;
                    const blue = (1 - scale) * 255;
                    return `rgb(${red}, ${green}, ${blue})`;
                },
                pointBackgroundColor: function (context) {
                    const value = context.dataset.data[context.dataIndex];
                    const min = Math.min(...context.dataset.data);
                    const max = Math.max(...context.dataset.data);
                    const scale = (value - min) / (max - min);
                    const red = scale * 255;
                    const green = 0;
                    const blue = (1 - scale) * 255;
                    return `rgb(${red}, ${green}, ${blue})`;
                },
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false,
                    suggestedMin: max, // max del valor maximo del valor Cuota
                    suggestedMax: min // min del valor minimo del valor Cuota
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