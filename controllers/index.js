const { Person, Movie } = require('../db');
const fetch = require('node-fetch');
const { fetchPersons } = require('../utils/fetchPersons');
require('dotenv').config();

const moviesAPI = "http://www.omdbapi.com/?apikey=db3e1c24&t=";
const personsAPI = 'https://api.celebrityninjas.com/v1/search?limit=10&name=';



module.exports = {
    getPerson : async (req, res) => {
        const { name, lastName, age, asActor, asDirector, asProducer } = req.body;
        const findedPerson = await Person.findOne({ where: { name: name } });
        findedPerson && res.status(401).json('Person exists in database.');
        
        const person = await Person.create({ name, lastName, age });

        let moviesActingId = [];
        const dbActing = await asActor.map( movieAsActor => {
            return Movie.findOne({ where: { title: movieAsActor } })
                .then(movieAsActor => moviesActingId = [...moviesActingId, movieAsActor.movieId])
        } );

        let moviesManagingId = [];
        const dbManaging = await asDirector.map( movieAsDirector => {
            return Movie.findOne({ where: { title: movieAsDirector } })
                .then(movieAsDirector => moviesManagingId = [...moviesManagingId, movieAsDirector.movieId])
        } );

        let moviesProducingId = [];
        const dbProducing = await asProducer.map( movieAsProducer => {
            return Movie.findOne({ where: { title: movieAsProducer } })
                .then(movieAsProducer => moviesProducingId = [...moviesProducingId, movieAsProducer.movieId])
        } );
        const arrayPromisesDatabase = [...dbActing, ...dbManaging, ...dbProducing];
        await Promise.all(arrayPromisesDatabase);
        await person.setCasting(moviesActingId);
        await person.setDirectors(moviesManagingId);
        await person.setProducers(moviesProducingId);

        await person.save();
        person && res.json(person);
    },
    getMovie: async (req, res) => {
        const { title } = req.query;
        const { Actors, Director, Production, Writer } = await (await fetch(moviesAPI + title)).json();

        const actors = Actors.split(', ');
        const director = Director;
        const producers = Production !== 'N/A' ? Production : Writer;

        let castingId = [];
        const dbCasting = await actors.map( actor => {
            const [name, lastName] = actor.split(' ');
            const { age } = fetchPersons(actor);
            return Person.findOrCreate({ where: { name, lastName, age } })
                .then(([actor, created]) => castingId = [...castingId, actor.personId])
        } );

        let directorsId = [];
        const dbDirectors = (director) => {
            const [name, lastName] = director.split(' ');
            const { age } = fetchPersons(director);
            return Person.findOrCreate({ where: { name, lastName, age } })
                .then(([director, created]) => directorsId = [...directorsId, director.personId])
        }
        dbDirectors(director);
        let producersId = [];

        const dbProducers = producers.length ? await producers.map( producer => {
            const [name, lastName] = producer.split(' ');

            return Person.findOrCreate({ where: { name, lastName } })
                .then(producer => producersId = [...producersId, producer.personId])
        } ) : (() => {
            const [name, lastName] = producers.split(' ');
            return Person.findOne({ where: { name, lastName } })
                .then(producer => producersId = [...producersId, producer.personId])
        })()


        // const arrayPromisesDatabase = [...dbCasting, ...dbDirectors, ...dbProducers];
        // await Promise.all(arrayPromisesDatabase);
        // await newMovie.setCasting(castingId);
        // await newMovie.setDirectors(directorsId);
        // await newMovie.setProducers(producersId);

        // await findedMovie.save();
        findedMovie && res.json(findedMovie);
    }
}