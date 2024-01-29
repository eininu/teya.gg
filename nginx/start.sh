#!/bin/sh

start_goaccess() {
    killall goaccess

    goaccess --real-time-html &
}

nginx -g 'daemon off;' &

while true; do
    start_goaccess
    sleep 60
done
