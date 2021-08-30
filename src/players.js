const client = require('./client');

function getPlayers (players) {
    return players.map(p => {
        return JSON.stringify({
            playerId: p.id,
            name: p.fullName,
            defaultPosition: p.defaultPosition,
            eligiblePositions: p.eligiblePositions
        })
    }).join('\n')
}

function getPlayerStatuses(players) {
    return players.map(p => {
        return JSON.stringify({
            playerId: p.id,
            teamId: p.proTeamAbbreviation,
            availability: p.availabilityStatus,
            injuryStatus: p.injuryStatus
        })
    }).join('\n')
}

module.exports = {getPlayers, getPlayerStatuses}