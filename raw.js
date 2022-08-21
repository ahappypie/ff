const s3upload = require('./src/s3upload');
const league = require('./src/league');
const teams = require('./src/teams');
const fsout = require('./src/fsout');
const getBoxscore = require('./src/scores');

(async () => {
    const season = 2021;
    const weekStart = 1;
    const weekEnd = 18;

    const lg = await league(season)
    fsout('leagues', season, lg)
    console.log(`league data for ${season} written`)

    for (let i = weekStart; i <= weekEnd; i++) {
        const tms = await teams(season, i)
        fsout('teams', season, tms, i)
        console.log(`fantasy roster data for ${season} week ${i} written`)
        const wk = await getBoxscore(season, i)
        fsout('players', season, wk.playerString, i)
        fsout('playerstatuses', season, wk.playerStatusString, i)
        fsout('stats', season, wk.statsString, i)
        fsout('projections', season, wk.projectedString, i)
        console.log(`player data for ${season} week ${i} written`)
    }


    console.log('dummy log')
})();