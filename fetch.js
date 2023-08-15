export const fetchApi = async (url) =>{    
    const response = await fetch(url) // adquiero la url
    const data =response.json() //la paso a json
    return data
}