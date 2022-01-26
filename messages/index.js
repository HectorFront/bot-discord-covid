module.exports = {

    /**
     *
     * @param discordMsg
     * @constructor
     */
    ERROR_HTTP_RESPONSE: discordMsg => {
        discordMsg.channel.send('Não foi possível realizar a busca dos dados.');
    }
}