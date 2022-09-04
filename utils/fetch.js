require('dotenv').config();
const fetch = require('node-fetch');
const personsAPI = 'https://api.celebrityninjas.com/v1/search?limit=10&name=';
const moviesAPI = "http://www.omdbapi.com/?apikey=db3e1c24&t=";

const fetchPersons = async (name) => {
    return await(await fetch(personsAPI + name, {
        headers: {
            'X-API-KEY': process.env.API_KEY_CELEBRITIES
        }
    })).json()
};

const fetchMovie = async (title) => {
    return await(await fetch(moviesAPI + title)).json()
};

module.exports = {
    getDataCelebritie: async (nameCelebritie) => {
        const person = await fetchPersons(nameCelebritie.toLowerCase());
        if(person){
            const [objectPerson] = person;
            const { age, name } = objectPerson;
            const [firstName, lastName] = name.split(' ');
    
            return { age, firstName, lastName, data: person };
        } else throw Error
    },
    fetchPersons,
    fetchMovie
}