const { Person, Movie } = require('../db');
const { getDataCelebritie, fetchMovie } = require('../utils/fetch');
require('dotenv').config();

module.exports = {
    getPerson : async (req, res) => {
        const { fullname, asActor, asDirector, asProducer } = req.body;
        const { firstName, lastName, age } = await getDataCelebritie(fullname);

        let newPerson = await Person.create({ name: firstName, lastName, age });

        let moviesActingId = [];
        const dbMoviesActing = asActor?.length ? await asActor.map( async movieAsActor => {
            const { Title, Year } = await fetchMovie(movieAsActor);

            return Movie.findOrCreate({ where: { title: Title, year: Year } })
                .then(([movieAsActor, created]) => moviesActingId = [...moviesActingId, movieAsActor.movieId])
        } ): null;

        let moviesManagingId = [];
        const dbMoviesManaging = await asDirector.map( async movieAsDirector => {
            const { title, year } = await fetchMovie(movieAsDirector);
            return Movie.findOrCreate({ where: { title, year } })
                .then(([movieAsDirector, created]) => moviesManagingId = [...moviesManagingId, movieAsDirector.movieId])
        } );

        let moviesProducingId = [];
        const dbMoviesProducing = await asProducer.map( async movieAsProducer => {
            const { title, year } = await fetchMovie(movieAsProducer);
            return Movie.findOrCreate({ where: { title, year } })
                .then(([movieAsProducer, created]) => moviesProducingId = [...moviesProducingId, movieAsProducer.movieId])
        } );

        // const arrayPromisesDatabase = [...dbMoviesActing];
        // await Promise.all(arrayPromisesDatabase);
        // await newPerson.addMovies(moviesActingId);
        // await newPerson.addDirectors(moviesManagingId);
        // await newPerson.addProducers(moviesProducingId);

        // await newPerson.save();
        newPerson && res.json(newPerson);
    },
    getMovie: async (req, res) => {
        const { title } = req.query;
        const { Year, Actors, Writer, Director } = await fetchMovie(title);
        const newMovie = await Movie.findOrCreate({ where: { title, year: Year } });

        const actors = Actors.split(', ');
        const director = Director;
        const producer = Writer.split(', ') ? Writer.split(', ')[0] : Writer;

        let castingId = [];
        const dbCasting = await actors.map( async actor => {
            const { firstName, lastName, age } = await getDataCelebritie(actor);
            return Person.findOrCreate({ 
                where: { name: firstName, lastName, age }
            }).then(([actor, created]) => castingId = [...castingId, actor.personId])
        } );

        let directorsId = [];
        const dbDirectors = (async directorName => {
            const { firstName, lastName, age } = await getDataCelebritie(directorName);
                return Person.findOrCreate({ 
                    where: { name: firstName, lastName, age },
                    default: { name: firstName, lastName, age }
                }).then(([director, created]) => directorsId = [...directorsId, director.personId])
        })(director);

        let producersId = [];
        const dbProducers = (async producer =>{
            const { firstName, lastName, age } = await getDataCelebritie(producer);
            return Person.findOrCreate({ 
                where: { name: firstName, lastName, age },
                default: { name: firstName, lastName, age } 
            }).then(([producer, created]) => producersId = [...producersId, producer.personId])
        })(producer);

        const arrayPromisesDatabase = [...dbCasting];
        //await Promise.all(arrayPromisesDatabase);
        //await newMovie.addPerson([...dbCasting]);
        //await newMovie.addPerson(directorsId);
        // await newMovie.addProducer(producersId);

        newMovie && res.json(newMovie);
    }
}