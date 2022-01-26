/** @name Internal */
import Formats from 'util/formats';
/** @name Dependencies */
const Messages = require("../messages");
const Constants = require("../constants");
const Request = require("../request/executor");

module.exports = {

    /**
     *
     * @param state
     * @param discordMsg
     */
    STATE: (stateClient, discordmsg) => {
        Request.Executor('/PortalEstado')
            .then(states => {
                states.map(state => {
                    if (stateClient === Formats.string(state.nome)) {
                        const constructorEmbed = { ...Constants.EMBED_MESSAGE_DC };
                        Constants.COD_UF.map(ufStates => {
                            if(ufStates.uf === (state.nome).toUpperCase()) {
                                constructorEmbed.embed.author.name = `Estado de ${ufStates.nome} - ${ufStates.uf}`;
                                constructorEmbed.embed.fields = [
                                    {
                                        name: 'Casos confirmados',
                                        value: `${Formats.number(state.casosAcumulado)} Pessoas`,
                                    }, {
                                        name: 'Óbitos acumulado',
                                        value: `${Formats.number(state.obitosAcumulado)} Pessoas`,
                                    }, {
                                        name: 'Incidência/100 mil hab.',
                                        value: `${state.incidencia}`,
                                    }, {
                                        name: 'Incidência de óbito/100 mil hab.',
                                        value: `${state.incidenciaObito}`,
                                    }
                                ];
                            }
                        });
                        discordmsg.channel.send(constructorEmbed);
                    }
                });
            }).catch(_ => Messages.ERROR_HTTP_RESPONSE(discordmsg));
    },

    /**
     *
     * @param discordMsg
     */
    BRAZIL: (discordmsg) => {
        Request.Executor('/PortalGeralApi')
            .then(brazil => {
                const constructorEmbed = {...Constants.EMBED_MESSAGE_DC};
                constructorEmbed.embed.author.name = 'BRASIL';
                constructorEmbed.embed.fields = [
                    {
                        name: 'Pessoas >> Em acompanhamento',
                        value: `${Formats.number(brazil.confirmados.acompanhamento)} Pessoas`,
                    }, {
                        name: 'Pessoas >> Recuperadas',
                        value: `${Formats.number(brazil.confirmados.recuperados)} Pessoas`,
                    }, {
                        name: 'Infectados >> Novos',
                        value: `${Formats.number(brazil.confirmados.novos)} Pessoas`,
                    }, {
                        name: 'Infectados >> Total de casos',
                        value: `${Formats.number(brazil.confirmados.total)} Pessoas`,
                    }, {
                        name: 'Infectados >> Incidência/100 Mil hab',
                        value: `${brazil.confirmados.incidencia}`,
                    }, {
                        name: 'Óbitos >> Letalidade/100 mil hab',
                        value: `${brazil.obitos.letalidade}%`,
                    }, {
                        name: 'Óbitos >> Mortalidade/100 mil hab',
                        value: `${brazil.obitos.mortalidade}`,
                    }, {
                        name: 'Óbitos >> Novos',
                        value: `${Formats.number(brazil.obitos.novos)} Pessoas`,
                    }, {
                        name: 'Óbitos >> Total',
                        value: `${Formats.number(brazil.obitos.total)} Pessoas`,
                    }
                ];
                discordmsg.channel.send(constructorEmbed);
            }).catch(_ => Messages.ERROR_HTTP_RESPONSE(discordmsg));
    },

    /**
     *
     * @param discordmsg
     * @constructor
     */
    CITY: (cityClient, discordmsg) => {
        Request.Executor('PortalMunicipio')
            .then(citys => {
                citys.map(city => {
                    if (cityClient === Formats.string(city.nome)) {
                        const constructorEmbed = {...Constants.EMBED_MESSAGE_DC};
                        Constants.COD_UF.map(ufStates => {
                            if (ufStates.codigo_uf === Number(city.cod.substr(0, 2))) {
                                constructorEmbed.embed.author.name = `${(city.nome).toUpperCase()} >> ${ufBrazil.nome} - ${ufBrazil.uf}`
                                constructorEmbed.embed.fields = [
                                    {
                                        name: 'Casos confirmados',
                                        value: `${Formats.number(city.casosAcumulado)} Pessoas`,
                                    }, {
                                        name: 'Óbitos acumulado',
                                        value: `${Formats.number(city.obitosAcumulado)} Pessoas`,
                                    }
                                ];
                            }
                        });
                        discordmsg.channel.send(constructorEmbed);
                    }
                })
            }).catch(_ => Messages.ERROR_HTTP_RESPONSE(discordmsg));
    }
};