const Commands = require("../commands");

module.exports = {

    /**
     *
     * @param command
     * @constructor
     */
    READY: (command, msg) => {
        const collect = command.split(' ')[1] ?? '';
        if (command.includes('covid')) {
            const REQUIREMENTS = {
                state: collect.length === 2, // Example: covid SP
                brazil: collect === 'brasil' // Example: covid brasil
            };
            if(REQUIREMENTS.state) {
                Commands.STATE(collect, msg);
            } else if(REQUIREMENTS.brazil){
                Commands.BRAZIL(msg);
            } else {
                Commands.CITY(collect, msg);
            }
        }
    }
}