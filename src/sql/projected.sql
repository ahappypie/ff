CREATE TABLE IF NOT EXISTS minio.fantasy.projected (
    playerId INTEGER,
    stat VARCHAR,
    number DOUBLE,
    season INTEGER,
    week INTEGER
) WITH (
      format = 'JSON',
      external_location = 's3a://fantasy/projected',
      partitioned_by = ARRAY['season', 'week']
);
drop table projected;
CALL system.sync_partition_metadata('fantasy', 'projected', 'FULL');
ANALYZE minio.fantasy.projected;

select * from projected;
