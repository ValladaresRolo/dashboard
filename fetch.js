/*
// basico de exportar e importar
export const sayHi1 = () => {
    console.log('Hola!!')
}*/

export const fetchApi = async (url) =>{
    const response = await fetch(url) // adquiero la url
    const data =response.json() //la paso a json
    return data
}