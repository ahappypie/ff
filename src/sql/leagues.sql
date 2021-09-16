CREATE TABLE IF NOT EXISTS minio.fantasy.leagues (
    id VARCHAR,
    name VARCHAR,
    season INTEGER
) WITH (
    format = 'JSON',
    external_location = 's3a://fantasy/leagues/',
    partitioned_by = ARRAY['season']
);

drop table leagues;

CALL system.sync_partition_metadata('fantasy', 'leagues', 'FULL');
ANALYZE minio.fantasy.leagues;

select * from leagues;