#!/bin/sh
# Запуск goaccess в фоновом режиме или в отдельном процессе
goaccess --real-time-html &

# Запуск nginx в переднем плане
nginx -g 'daemon off;'