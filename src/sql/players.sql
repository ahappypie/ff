CREATE TABLE IF NOT EXISTS minio.fantasy.players (
    playerId INTEGER,
    name VARCHAR,
    defaultPosition VARCHAR,
    eligiblePositions ARRAY<VARCHAR>,
    season INTEGER
) WITH (
    format = 'JSON',
    external_location = 's3a://fantasy/players',
    partitioned_by = ARRAY['season']
);

CALL system.sync_partition_metadata('fantasy', 'players', 'FULL');
ANALYZE minio.fantasy.players;

select * from players;

select playerid, name, defaultposition, eligiblepositions, season, count(*)
from players
group by playerid, name, defaultposition, eligiblepositions, season
having count(*) > 1;

select *, s.number - pr.number as diff
from players p
inner join stats s on p.playerid = s.playerid and p.season = s.season
inner join projected pr on p.playerid = pr.playerid and p.season = pr.season and s.stat = pr.stat
where s.week = 2
and p.defaultposition = 'RB'
and s.stat = 'rushingYards'
order by diff desc