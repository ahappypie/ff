CREATE SCHEMA delta.nfl
    WITH (location = 's3a://fantasy/nfl');

create table delta.nfl.players (dummy bigint)
    with (
        location = 's3a://fantasy/nfl/players'
        );

create table delta.nfl.weekly (dummy bigint)
with (
    location = 's3a://fantasy/nfl/weekly'
    );

create table delta.nfl.teams (dummy bigint)
    with (
        location = 's3a://fantasy/nfl/teams'
        );

select p.name, w.stats, w.projections
from players p
         left join weekly w on p.id = w.playerId
where w.season = 2019 and w.week = 1;

SELECT
    *

FROM weekly a
CROSS JOIN UNNEST(a.stats) WITH ORDINALITY AS b;