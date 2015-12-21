#!/bin/bash

cd /data/app/iucn-geocatalogue
case $1 in
  start)
    docker-compose -f docker-compose.production.yml start
    shift
    ;;

  restart)
    docker-compose -f docker-compose.production.yml stop
    docker-compose -f docker-compose.production.yml start
    shift # past argument=value
    ;;

  refresh)
    docker-compose -f docker-compose.production.yml build
    docker-compose -f docker-compose.production.yml stop
    docker-compose -f docker-compose.production.yml rm -f
    docker-compose -f docker-compose.production.yml up -d
    nginx refresh

    shift
    ;;

  stop)
    docker-compose -f docker-compose.production.yml stop
    ;;
    *)
      echo "Bad parameters"
      exit
    ;;
esac
