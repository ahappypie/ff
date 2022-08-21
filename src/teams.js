const client = require('./client');

module.exports = async function(season, week) {
    const result = await client.getTeamsAtWeek({seasonId: season, scoringPeriodId: week});

    const teams = result.map(t => {
        return {id: t.id, leagueId: t.leagueId, season: t.seasonId, week: week,
            abbreviation: t.abbreviation, name: t.name, roster: t.roster.map(p => {return p.id})}
    })

    return JSON.stringify(teams);
}