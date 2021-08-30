const client = require('./client');

module.exports = async function(season) {
    const result = await client.getLeagueInfo({seasonId: season});

    return JSON.stringify({...result, id: process.env.LEAGUE_ID});
}