/** @name Dependencies */
const axios = require('axios').default;

module.exports = {

    /**
     *
     * @param route
     * @returns {Promise<unknown>}
     * @constructor
     */
    Executor: route => {
        return new Promise((resolve, reject) => {
            axios.get(`${process.env.API_HOST}${route}`)
                .then(response => resolve(response.data))
                .catch(_ => reject());
        })
    }
}