import { fetchApi } from "./fetch.js";

let valoresUf = []; // arreglo para guardar los datos
let fechas = [];

// esto es para el color
const rgbaRedColor = 'rgba(255, 99, 132, 0.2)';
const rgbRedColor = 'rgb(255, 99, 132)';

const rgbaOrangeColor = 'rgba(255, 159, 64, 0.2)';
const rgbOrangeColor = 'rgb(255, 159, 64)';


const form = document.querySelector("form");
const afpSelect = document.querySelector("#afp");
const fondoSelect = document.querySelector("#fondo");
const button = document.querySelector("#boton")

button.addEventListener("click", (event) => {
    event.preventDefault();

    const afp = afpSelect.value;
    const fondo = fondoSelect.value;
    console.log(afp, fondo);

    renderData(afp, fondo)

});


async function renderData(afp, fondo) {

    console.log(afp, fondo);
    const urlApi = (`https://www.quetalmiafp.cl/api/Cuota/ObtenerCuotas?listaAFPs=${afp}&listaFondos=${fondo}&fechaInicial=01%2F05%2F2023&fechaFinal=13%2F08%2F2023`);



    const valoresCuota = await fetchApi(urlApi);

    // const valoresCuota = await fetchApi(`https://www.quetalmiafp.cl/api/Cuota/ObtenerCuotas?listaAFPs=${afp}&listaFondos=${fondo}&fechaInicial=01%2F05%2F2023&fechaFinal=13%2F08%2F2023`);  


    console.log(urlApi);

    //.then(data => console.log(data)) // pa saber si la data llega
    valoresUf = valoresCuota.map(valorCuota => valorCuota.valorUf) // .map itera todo el arreglo y devuelve un arreglo nuevo
    fechas = valoresCuota.map(valorCuota => valorCuota.fecha)// .map itera todo el arreglo y devuelve un arreglo nuevo

    const backgroundColors = valoresUf.map(valorUf => valorUf > 3 ? rgbaRedColor : rgbaOrangeColor)  // aca doy instruccion de color 
    const borderColors = valoresUf.map(valorUf => valorUf > 3 ? rgbRedColor : rgbOrangeColor)  // aca doy instruccion de color 

    console.log('valoresUf: ', valoresUf); // compruebo los datos
    console.log('fechas: ', fechas) // compruebo los datos

    // Creas una variable para guardar la instancia de la gráfica
var myChart;

// Obtienes el contexto del canvas
const ctx = document.getElementById('myChart');

// Antes de crear la gráfica, destruyes la anterior si existe
if (myChart) {
  myChart.destroy();
}

// Luego creas la nueva gráfica con el mismo canvas y guardas la instancia en la variable
myChart = new Chart(ctx, {
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
                        label: function (context) {
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
//renderData();