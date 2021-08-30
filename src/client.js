const { Client } = require('espn-fantasy-football-api/node-dev');

const ESPNClient = new Client({leagueId: process.env.LEAGUE_ID});
ESPNClient.setCookies({espnS2: process.env.ESPN_S2, SWID: process.env.SWID});

module.exports = ESPNClient;