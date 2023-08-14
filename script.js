/*
// basico de importar y exportar
import { sayHi1 } from "./fetch.js";
sayHi1()*/

import { fetchApi } from "./fetch.js";

let valoresUf = []; // arreglo para guardar los datos
let fechas = [];

// esto es para el color
const rgbaRedColor = 'rgba(255, 99, 132, 0.2)';
const rgbRedColor = 'rgb(255, 99, 132)';

const rgbaOrangeColor = 'rgba(255, 159, 64, 0.2)';
const rgbOrangeColor = 'rgb(255, 159, 64)';


async function renderData() {
    
    const valoresCuota = await fetchApi('https://www.quetalmiafp.cl/api/Cuota/ObtenerCuotas?listaAFPs=MODELO&listaFondos=C&fechaInicial=01%2F05%2F2023&fechaFinal=13%2F08%2F2023');


  //.then(data => console.log(data)) // pa saber si la data llega
    valoresUf = valoresCuota.map(valorCuota => valorCuota.valorUf) // .map itera todo el arreglo y devuelve un arreglo nuevo
    fechas = valoresCuota.map(valorCuota => valorCuota.fecha)// .map itera todo el arreglo y devuelve un arreglo nuevo

    const backgroundColors = valoresUf.map(valorUf => valorUf > 3 ? rgbaRedColor : rgbaOrangeColor)  // aca doy instruccion de color 
    const borderColors = valoresUf.map(valorUf => valorUf > 3 ? rgbRedColor : rgbOrangeColor)  // aca doy instruccion de color 

    console.log('valoresUf: ', valoresUf); // compruebo los datos
    console.log('fechas: ', fechas) // compruebo los datos

    const ctx = document.getElementById('myChart');

    new Chart(ctx, {
        type: 'line',
        data: {
            //labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            labels: fechas,
            datasets: [{
                //label: '# of Votes',
                //data: [12, 19, 3, 5, 2, 3],
                label: 'Magitud de terremoto',
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
                    suggestedMin: 35800,
                    suggestedMax: 36000
                }
            },

            // modifica el tooltip
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
    
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y + '°';  // modifeica el texto renderisado
                            }
                            return label;
                        }
                    }
                }
            }
            
        }
    });
}
renderData();