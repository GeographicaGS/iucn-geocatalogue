# IUCN GeoCatalogue

## Create data container
```
docker create --name mexicodf_pgdata -v /var/lib/postgresql/data debian /bin/true
```

## Initiate database
### Start the database container
```
docker-compose -f docker-compose.production.yml up pgsql
```
### Execute the SQL commands
```
docker run --rm -it -v $(pwd)/database:/db -e PASSWORD=admin --link iucngeocatalogue_pgsql_1:db postgres:9.4 psql -U geocat -h db -f /db/initial.sql
```
