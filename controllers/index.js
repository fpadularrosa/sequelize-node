const { Persons, Movies, Roles } = require('../db');
const { getDataCelebritie, fetchMovie } = require('../utils/fetch');
require('dotenv').config();

const createRolesTable = (async () => {
    await Roles.findOrCreate({where: { roleName: 'actor' }});
    await Roles.findOrCreate({where: { roleName: 'director' }});
    await Roles.findOrCreate({where: { roleName: 'producer' }});
})();

module.exports = {
    getPerson : async (req, res) => {
        const { fullname, asActor, asDirector, asProducer } = req.body;
        const { firstName, lastName, age } = await getDataCelebritie(fullname);
        
        let [orderedPerson, created] = await Persons.findOrCreate({ where: { name: firstName, lastName, age } });

        if (asActor.length >= 1) asActor.map( async movieAsActor => {
            const data = await fetchMovie(movieAsActor);
            if(data !== null){
                const { Title:title, Year:year } = data;

            return Movies.findOrCreate({ where: { title, year } })
                .then(async([movieAsActor, created]) => { 
                    const { id: movie_id } = movieAsActor.dataValues;
                    await orderedPerson.addMovie(movie_id, { through: { roleId: 1 } });
                })
            }
        });

        if (asDirector.length >= 1) asDirector.map( async movieAsDirector => {
            const data = await fetchMovie(movieAsDirector);
            if(data !== null){
                const { Title: title, Year: year } = data;

                return Movies.findOrCreate({ where: { title, year } })
                .then(async ([movieAsDirector, created]) => {
                    const { id: movie_id } = movieAsDirector.dataValues;
                    await orderedPerson.addMovie(movie_id, { through: { roleId: 2 } });
                })
            }
        }); 

        if (asProducer.length >= 1) asProducer.map( async movieAsProducer => {
            const data = await fetchMovie(movieAsProducer);
            if(data !== null){
                const { Title: title, Year: year } = data;

                return Movies.findOrCreate({ where: { title, year } })
                .then(async([movieAsProducer, created]) => {
                    const { id: movie_id } = movieAsProducer.dataValues;
                    await orderedPerson.addMovie(movie_id, { through: { roleId: 3 } });
                });
            }
        });

        orderedPerson && res.json(orderedPerson);
    },
    getMovie: async (req, res) => {
        const { title } = req.query;
        const { Year: year, Actors, Writer, Director } = await fetchMovie(title);
        const [orderedMovie, created] = await Movies.findOrCreate({ where: { title, year } });

        const directors = Director.split(', ').length > 1 ? Director.split(', ') : Director;
        const actors = Actors.split(', ');
        const producer = Writer.split(', ')[0];

        actors?.map( async actor => {
            const data = await getDataCelebritie(actor);
            if(data !== null){
                const { age, firstName, lastName } = data;

                return Persons.findOrCreate({ where: { name: firstName, lastName, age }})
                .then(async ([actor, created]) => {
                    const { id:person_id } = actor.dataValues;
                    await orderedMovie.addPerson(person_id, { through: { roleId: 1 } });
                })
            };
            return;
        });

        typeof directors === 'string' ? (async director => {
                const data = await getDataCelebritie(director);
                if(data !== null) {
                    const { age, firstName, lastName } = data;

                    return await Persons.findOrCreate({ 
                        where: { name: firstName, lastName, age }
                    }).then(async ([director, created]) => {
                        const { id } = director.dataValues;
                        await orderedMovie.addPerson(id, { through: { roleId: 2 } });
                    });
                } else return null;
            })(directors) : directors.map( async directorName => {
                const data = await getDataCelebritie(directorName);
                if(data !== null) {
                    const { age, firstName, lastName } = data;
                    return await Persons.findOrCreate({ 
                        where: { name: firstName, lastName, age }
                    }).then(async ([director, created]) => {
                        const { id } = director.dataValues;
                        await orderedMovie.addPerson(id, { through: { roleId: 2 } });
                    });
                }
                return;
            } );

        (async producer => {
            const data = await getDataCelebritie(producer);
            if(data !== null){
                const { age, firstName, lastName } = data;
                return Persons.findOrCreate({ 
                    where: { name: firstName, lastName, age }
                }).then(async ([producer, created]) => {
                    const { id } = producer.dataValues;
                    await orderedMovie.addPerson(id, { through: { roleId: 3 } })
                });
            }
            return null;
        })(producer);
        
        orderedMovie && res.json(orderedMovie);
    }
}