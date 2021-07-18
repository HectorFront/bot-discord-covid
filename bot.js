require('dotenv').config()
const axios = require('axios').default;
const Discord = require('discord.js');
const client = new Discord.Client();

const accessToken = 'ODY2MzY1MDU2NTM1MTAxNDcx.YPRfVQ.8P0dKlDsu65brLe81D7annl1XDM';

const DEFAULT_MESSAGE = {
    content: '',
    embed: {
        color: 11416728,
        author: {
            name: null,
            icon_url: 'https://cdn.discordapp.com/avatars/866365056535101471/b0aee935fb3b0d998cfc0c5c86f5c470.png?size=256'
        },
        description: '',
        footer: {
            icon_url: 'https://cdn.discordapp.com/icons/761769910036070410/a_ff378ed1507c70c669e6dace2376461e.png?size=256',
            text: '© Desenvolvido por Hector Silva (Entertainments Katraka)'
        },
        fields: []
    }
};

const formatNumber = (int) => {
    return (Number(int)).toLocaleString('pt-BR');
};

const formatString = (str) => {
    return (str.normalize("NFD").replace(/[^a-zA-Zs]/g, "")).toLowerCase();
};

const ExecutorGETRequest = (route) => {
    return new Promise((resolve, reject) => {
        axios.get(`${process.env.API_HOST}/${route}`)
            .then(response => resolve(response.data))
            .catch(_ => reject());
    })
}

const DEFAULT_DISCORD_ERROR = (msg) => {
    msg.reply('Aconteceu algum erro, volte novamente mais tarde! byKatraka');
}

client.on('ready', () => {
    console.log('Status => Ok [Online]');
});

client.on('message', (msg) => {
    const msgClient = formatString(msg.content);
    if (msgClient.includes('covid')) {
        const typeCommand_Client = msgClient.replace('covid', '');
        if (typeCommand_Client.length === 2) {
            ExecutorGETRequest('PortalEstado')
                .then(states => {
                    states.map(state => {
                        const state_API = formatString(state.nome);
                        if (typeCommand_Client === state_API) {
                            const messageState = { ...DEFAULT_MESSAGE };
                            messageState.embed.author.name = `Estado de ${(state.nome).toUpperCase()}`;
                            messageState.embed.fields = [
                                {
                                    name: '_Casos confirmados_',
                                    value: `${formatNumber(state.casosAcumulado)} Pessoas`,
                                }, {
                                    name: '_Óbitos acumulado_',
                                    value: `${formatNumber(state.obitosAcumulado)} Pessoas`,
                                }, {
                                    name: '_Incidência_',
                                    value: `${state.incidencia}%`,
                                }, {
                                    name: '_Incidência de óbito_',
                                    value: `${state.incidenciaObito}%`,
                                }
                            ];
                            return msg.channel.send(messageState);
                        }
                    });
                }).catch(_ => DEFAULT_DISCORD_ERROR(msg));
        } else if (typeCommand_Client === 'brasil') {
            ExecutorGETRequest('PortalGeralApi')
                .then(brasil => {
                    const messageBrazil = { ...DEFAULT_MESSAGE };
                    messageBrazil.embed.author.name = 'BRASIL';
                    messageBrazil.embed.fields = [
                        {
                            name: '(Confirmados) _Em acompanhamento_',
                            value: `${formatNumber(brasil.confirmados.acompanhamento)} Pessoas`,
                        }, {
                            name: '(Confirmados) _Incidência_',
                            value: `${brasil.confirmados.incidencia}%`,
                        }, {
                            name: '(Confirmados) _Novos_',
                            value: `${formatNumber(brasil.confirmados.novos)} Pessoas`,
                        }, {
                            name: '(Confirmados) _Recuperados_',
                            value: `${formatNumber(brasil.confirmados.recuperados)} Pessoas`,
                        }, {
                            name: '(Confirmados) _Total de casos_',
                            value: `${formatNumber(brasil.confirmados.total)} Pessoas`,
                        }, {
                            name: '(Óbitos) _Letalidade_',
                            value: `${brasil.obitos.letalidade}%`,
                        }, {
                            name: '(Óbitos) _Mortalidade_',
                            value: `${brasil.obitos.mortalidade}%`,
                        }, {
                            name: '(Óbitos) _Novos_',
                            value: `${formatNumber(brasil.obitos.novos)}`,
                        }, {
                            name: '(Óbitos) _Total_',
                            value: `${formatNumber(brasil.obitos.total)}`,
                        }
                    ];
                    msg.channel.send(messageBrazil);
                }).catch(_ => DEFAULT_DISCORD_ERROR(msg));
        } else {
            ExecutorGETRequest('PortalMunicipio')
                .then(citys => {
                    citys.map(city => {
                        const city_API = formatString(city.nome);
                        if (typeCommand_Client === city_API) {
                            const messageCity = { ...DEFAULT_MESSAGE };
                            messageCity.embed.author.name = (city.nome).toUpperCase();
                            messageCity.embed.fields = [
                                {
                                    name: '_Casos confirmados_',
                                    value: `${formatNumber(city.casosAcumulado)} Pessoas`,
                                }, {
                                    name: '_Óbitos acumulado_',
                                    value: `${formatNumber(city.obitosAcumulado)} Pessoas`,
                                }
                            ];
                            return msg.channel.send(messageCity);
                        }
                    });
                }).catch(_ => DEFAULT_DISCORD_ERROR(msg));
        }
    }
});

client.login(accessToken);