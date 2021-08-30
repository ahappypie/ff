const client = require('./client');
const {getPlayers, getPlayerStatuses} = require('./players');

async function getBoxscore(season, week) {
    const boxscores = await client.getBoxscoreForWeek(
        {seasonId: season, matchupPeriodId: week, scoringPeriodId: week}
    );
    const freeAgents = await client.getFreeAgents({seasonId: season, scoringPeriodId: week});

    const players = getPlayerStatsFromBoxscore(boxscores).map(obj => obj.player).concat(freeAgents.map(obj => obj.player))
    const playerStats = getPlayerStatsFromBoxscore(boxscores)

    if(playerStats.length > 0) {
        const {statsString, projectedString} = makeStats(playerStats);
        const playerString = getPlayers(players);
        const playerStatusString = getPlayerStatuses(players);

        return {statsString, projectedString, playerString, playerStatusString};
    }
}
function getPlayerStatsFromBoxscore(boxscores) {
    return boxscores.map(bs => {
        return bs.homeRoster.concat(bs.awayRoster).map(bsplayer => {
            return {
                player: bsplayer.player,
                rawStats: bsplayer.rawStats,
                projectedRawStats: bsplayer.projectedRawStats
            }
        })
    }).flat()
}

function makeStats(data) {
    const stats = data.map(bsplayer => {
        const stats = Object.entries(bsplayer.rawStats).filter(stat => stat[0] !== 'usesPoints').map(stat => {
            return {
                playerId: bsplayer.player.id,
                stat: stat[0],
                number: stat[1]
            }
        })

        const projected = Object.entries(bsplayer.projectedRawStats).filter(stat => stat[0] !== 'usesPoints').map(stat => {
            return {
                playerId: bsplayer.player.id,
                stat: stat[0],
                number: stat[1]
            }
        })
        return {stats, projected}
    })

    const statsString = stats.flat().flatMap(obj => obj.stats).map(JSON.stringify).join('\n')

    const projectedString = stats.flat().flatMap(obj => obj.projected).map(JSON.stringify).join('\n')

    return {statsString, projectedString};
}

module.exports = getBoxscore