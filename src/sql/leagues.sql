CREATE TABLE IF NOT EXISTS minio.fantasy.leagues (
    id VARCHAR,
    name VARCHAR
) WITH (
    format = 'JSON',
    external_location = 's3a://fantasy/leagues/'
);

drop table leagues;
select * from leagues;