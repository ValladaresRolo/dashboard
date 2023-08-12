/*
// basico de importar y exportar
import { sayHi1 } from "./fetch.js";
sayHi1()*/

import { fetchApi } from "./fetch.js";

let magnitudes = []; // arreglo para guardar los datos
let geographicReferences = [];

// esto es para el color
const rgbaRedColor = 'rgba(255, 99, 132, 0.2)';
const rgbRedColor = 'rgb(255, 99, 132)';

const rgbaOrangeColor = 'rgba(255, 159, 64, 0.2)';
const rgbOrangeColor = 'rgb(255, 159, 64)';


async function renderData() {
    const earthquakes = await fetchApi('https://api.gael.cloud/general/public/sismos')  // llamo a la api
    //.then(data => console.log(data)) // pa saber si la data llega
    magnitudes = earthquakes.map(earthquake => earthquake.Magnitud) // .map itera todo el arreglo y devuelve un arreglo nuevo
    geographicReferences = earthquakes.map(earthquake => earthquake.RefGeografica)// .map itera todo el arreglo y devuelve un arreglo nuevo

    const backgroundColors = magnitudes.map(magnitude => magnitude > 3 ? rgbaRedColor : rgbaOrangeColor)  // aca doy instruccion de color 
    const borderColors = magnitudes.map(magnitude => magnitude > 3 ? rgbRedColor : rgbOrangeColor)  // aca doy instruccion de color 

    console.log('magnitudes: ', magnitudes); // compruebo los datos
    console.log('geographicReference: ', geographicReferences) // compruebo los datos

    const ctx = document.getElementById('myChart');

    new Chart(ctx, {
        type: 'bar',
        data: {
            //labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            labels: geographicReferences,
            datasets: [{
                //label: '# of Votes',
                //data: [12, 19, 3, 5, 2, 3],
                label: 'Magitud de terremoto',
                data: magnitudes,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
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
