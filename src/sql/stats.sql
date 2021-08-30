CREATE TABLE IF NOT EXISTS minio.fantasy.stats (
    playerId INTEGER,
    stat VARCHAR,
    number INTEGER,
    season INTEGER,
    week INTEGER
) WITH (
    format = 'JSON',
    external_location = 's3a://fantasy/stats',
    partitioned_by = ARRAY['season', 'week']
);
drop table stats;
CALL system.sync_partition_metadata('fantasy', 'stats', 'FULL');
ANALYZE minio.fantasy.stats;

select * from stats;