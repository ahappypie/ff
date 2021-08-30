const league = require('./src/input/league.json')[0]

const teams = Object.fromEntries(league.teams.map(team => {return [team.id,  team.abbrev]}))

const matchups = require('./src/input/matchups.json')[0].schedule

const scores = matchups.filter(matchup => matchup.matchupPeriodId < 14).map(matchup => {
    return {week: matchup.matchupPeriodId, away: {id: matchup.away.teamId, name: teams[matchup.away.teamId], score: matchup.away.totalPoints}, home: {id: matchup.home.teamId, name: teams[matchup.home.teamId], score: matchup.home.totalPoints}}
})

const headers = [['week', 'homeTeam', 'homeScore', 'awayTeam', 'awayScore'].join(',')]
const scoresStringArr = scores.map(score => {return [score.week, score.home.name, score.home.score, score.away.name, score.away.score].join(',')})

const scoresCsv = [...headers, ...scoresStringArr].join('\n')

const regularRecords = {};
for(const [k,v] of Object.entries(teams)) {
    regularRecords[k] = {team: v, wins: 0, losses: 0}
}

scores.forEach(s => {
    const game = [s.home, s.away].sort((a,b) => parseFloat(b.score) - parseFloat(a.score))
    const winner = game[0]
    const loser = game[1]
    regularRecords[winner.id].wins++
    regularRecords[loser.id].losses++;
})

const weightedRecords = {};
for(const [k,v] of Object.entries(regularRecords)) {
    weightedRecords[k] = {team: v.team, wins: v.wins, weeklyPoints: []}
}

const weeklyScoreboard = {};
scores.forEach(s => {
    if(!weeklyScoreboard[s.week]) {
        weeklyScoreboard[s.week] = []
    }
    weeklyScoreboard[s.week].push([s.home, s.away])
})

Object.entries(weeklyScoreboard).forEach(arr => {
    const sorted = arr[1].flat().sort((a,b) => a.score-b.score).map((v, i) => {return {id: v.id, points: i}})

    sorted.forEach(s => {
        weightedRecords[s.id].weeklyPoints.push(s.points)
    })
})

for(const [k,v] of Object.entries(weightedRecords)) {
    weightedRecords[k].regularPoints = v.wins * 12
    weightedRecords[k].weeklyBonus = v.weeklyPoints.reduce((acc, cum) => acc + cum)
    weightedRecords[k].totalPoints = weightedRecords[k].regularPoints + weightedRecords[k].weeklyBonus
}

const weightedHeaders = [['team', 'regularPoints', 'weeklyBonus', 'totalPoints'].join(',')]
const weightedScoresStringArr = Object.entries(weightedRecords).sort((a,b) => b[1].totalPoints - a[1].totalPoints).map(([k,v]) => {return [v.team, v.regularPoints, v.weeklyBonus, v.totalPoints].join(',')})

const weightedScoresCsv = [...weightedHeaders, ...weightedScoresStringArr].join('\n')

console.log('dummy line for debugger')

const fs = require('fs');
fs.writeFileSync('./data/output/scores.csv', scoresCsv)
fs.writeFileSync('./data/output/weightedScores.csv', weightedScoresCsv)