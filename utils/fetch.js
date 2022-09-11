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
    const dataMovie = await(await fetch(moviesAPI + title)).json()
    dataMovie.Response === 'False' && null;
    return dataMovie;
};

module.exports = {
    getDataCelebritie: async (nameCelebritie) => {
        try {
            const person = await fetchPersons(nameCelebritie.toLowerCase());
            if(person.length){
                const { age, name } = person[0];
                const [firstName, lastName] = name.split(' ');
                const data = { 
                    age, 
                    firstName, 
                    lastName
                };

                return data;
            } else return null;
        } catch (error) {
            console.error(error)
        }
    },
    fetchPersons,
    fetchMovie
}