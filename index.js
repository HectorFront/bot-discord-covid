require('dotenv').config()
const axios = require('axios').default;
const Discord = require('discord.js');
const http = require('http');
const express = require('express')
const app = express();
const client = new Discord.Client();
const { createTerminus } = require('@godaddy/terminus');
const codStateBRAZIL = require('./constants/cod-uf');

const PORT = process.env.PORT || 8877;
const accessToken = process.env.TOKEN_DISCORD;

app.get('/', (req, res) => {
    res.status(200).send('BOT => [ok]');
});

const server = http.createServer(app)

const onSignal = () => {
    console.log('server is starting cleanup');
}

const onHealthCheck = async () => {
    console.log({ server: '[Status] => OK' });
}

createTerminus(server, {
    signal: 'SIGINT',
    healthChecks: { '/healthcheck': onHealthCheck },
    onSignal
});

const DEFAULT_MESSAGE = {
    content: '',
    embed: {
        color: 11416728,
        author: {
            name: null,
            icon_url: 'https://inovarevistorias.com.br/assets/pointer.png'
        },
        description: '',
        footer: {
            icon_url: 'https://www.vippng.com/png/full/372-3727616_h-png-helium-logo.png',
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

const ExecutorStatusHealth = () => {
    return new Promise((resolve, reject) => {
        axios.get('https://katraka-covid.herokuapp.com/')
            .then(_ => resolve('Check API [Ok]'))
            .catch(_ => reject('Failed API [error]'));
    });
};

const ExecutorGETRequestCOVID = (route) => {
    return new Promise((resolve, reject) => {
        axios.get(`${process.env.API_HOST}/${route}`)
            .then(response => resolve(response.data))
            .catch(_ => reject());
    })
};

const DEFAULT_DISCORD_ERROR = (msg) => {
    msg.reply('Aconteceu algum erro, volte novamente mais tarde! byKatraka');
};

client.on('ready', () => {
    console.log('[Discord Status] => Ok');
});

client.on('message', (msg) => {
    const msgClient = formatString(msg.content);
    if (msgClient.includes('covid')) {
        const typeCommand_Client = msgClient.replace('covid', '');
        if (typeCommand_Client.length === 2) {
            ExecutorGETRequestCOVID('PortalEstado')
                .then(states => {
                    states.map(state => {
                        const state_API = formatString(state.nome);
                        if (typeCommand_Client === state_API) {
                            const messageState = { ...DEFAULT_MESSAGE };
                            codStateBRAZIL.map(ufBrazil => {
                                if(ufBrazil.uf === (state.nome).toUpperCase()) {
                                    messageState.embed.author.name = `Estado de ${ufBrazil.nome} - ${ufBrazil.uf}`;
                                    messageState.embed.fields = [
                                        {
                                            name: 'Casos confirmados',
                                            value: `${formatNumber(state.casosAcumulado)} Pessoas`,
                                        }, {
                                            name: 'Óbitos acumulado',
                                            value: `${formatNumber(state.obitosAcumulado)} Pessoas`,
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
                            msg.channel.send(messageState);
                        }
                    });
                }).catch(_ => DEFAULT_DISCORD_ERROR(msg));
        } else if (typeCommand_Client === 'brasil') {
            ExecutorGETRequestCOVID('PortalGeralApi')
                .then(brasil => {
                    const messageBrazil = { ...DEFAULT_MESSAGE };
                    messageBrazil.embed.author.name = 'BRASIL';
                    messageBrazil.embed.fields = [
                        {
                            name: 'Pessoas >> Em acompanhamento',
                            value: `${formatNumber(brasil.confirmados.acompanhamento)} Pessoas`,
                        }, {
                            name: 'Pessoas >> Recuperadas',
                            value: `${formatNumber(brasil.confirmados.recuperados)} Pessoas`,
                        }, {
                            name: 'Infectados >> Novos',
                            value: `${formatNumber(brasil.confirmados.novos)} Pessoas`,
                        }, {
                            name: 'Infectados >> Total de casos',
                            value: `${formatNumber(brasil.confirmados.total)} Pessoas`,
                        }, {
                            name: 'Infectados >> Incidência/100 Mil hab',
                            value: `${brasil.confirmados.incidencia}`,
                        }, {
                            name: 'Óbitos >> Letalidade/100 mil hab',
                            value: `${brasil.obitos.letalidade}%`,
                        }, {
                            name: 'Óbitos >> Mortalidade/100 mil hab',
                            value: `${brasil.obitos.mortalidade}`,
                        }, {
                            name: 'Óbitos >> Novos',
                            value: `${formatNumber(brasil.obitos.novos)} Pessoas`,
                        }, {
                            name: 'Óbitos >> Total',
                            value: `${formatNumber(brasil.obitos.total)} Pessoas`,
                        }
                    ];
                    msg.channel.send(messageBrazil);
                }).catch(_ => DEFAULT_DISCORD_ERROR(msg));
        } else {
            ExecutorGETRequestCOVID('PortalMunicipio')
                .then(citys => {
                    citys.map(city => {
                        const city_API = formatString(city.nome);
                        if (typeCommand_Client === city_API) {
                            const messageCity = { ...DEFAULT_MESSAGE };
                            codStateBRAZIL.map(ufBrazil => {
                                if(ufBrazil.codigo_uf === Number(city.cod.substr(0, 2))) {
                                    messageCity.embed.author.name = `${(city.nome).toUpperCase()} >> ${ufBrazil.nome} - ${ufBrazil.uf}`
                                    messageCity.embed.fields = [
                                        {
                                            name: 'Casos confirmados',
                                            value: `${formatNumber(city.casosAcumulado)} Pessoas`,
                                        }, {
                                            name: 'Óbitos acumulado',
                                            value: `${formatNumber(city.obitosAcumulado)} Pessoas`,
                                        }
                                    ];
                                }
                            });
                            msg.channel.send(messageCity);
                        }
                    });
                }).catch(_ => DEFAULT_DISCORD_ERROR(msg));
        }
    }
});

client.login(accessToken);
server.listen(PORT, () => {
    setInterval(() => {
        ExecutorStatusHealth()
            .then(log => console.log(log))
            .catch(err => console.log(err));
    }, 30000);
});
