#!/bin/sh

start_goaccess() {
    killall goaccess

    goaccess &
}

nginx -g 'daemon off;' &

while true; do
    start_goaccess
    sleep 60
done

## test