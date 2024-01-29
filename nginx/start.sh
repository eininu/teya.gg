#!/bin/sh
# Запуск goaccess в фоновом режиме или в отдельном процессе
goaccess &

# Запуск nginx в переднем плане
nginx -g 'daemon off;'