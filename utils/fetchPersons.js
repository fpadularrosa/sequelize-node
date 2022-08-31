module.exports = {
    fetchPersons: async (name) => {
        return fetch(personsAPI + name, {
            headers: {
                'X-API-KEY': process.env.API_KEY_CELEBRITIES
            }
        })
        .then(res => res.json())
        .then(res => {
            return res
        })
    }
}