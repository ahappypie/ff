const league = require('./src/league');
const getBoxscore = require('./src/scores');
const s3upload = require('./src/s3upload');

(async () => {
    const season = 2021;
    const week = 1;
    const l = await league(season);
    await s3upload(`leagues/season=${season}/${process.env.LEAGUE_ID}`, l);

    const s = await getBoxscore(season, week);
    await s3upload(`stats/season=${season}/week=${week}/${process.env.LEAGUE_ID}`, s.statsString);
    await s3upload(`projected/season=${season}/week=${week}/${process.env.LEAGUE_ID}`, s.projectedString);
    await s3upload(`players/season=${season}/${process.env.LEAGUE_ID}`, s.playerString);
    await s3upload(`playerstatus/season=${season}/week=${week}/${process.env.LEAGUE_ID}`, s.playerStatusString);



    console.log('dummy log')
})();