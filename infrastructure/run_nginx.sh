#!/bin/bash

# help text
read -r -d '' HELP <<- EOM
  Benutzung: $0
    -p <optional Port, default 80>
    -n <required Pfad zu NGINX config nginx.conf>
    -a <required Pfad zu der Applikation dist/>
    -d <required Pfad zu den Daten data/>
    -t <required Ein Verzeichnis für die temporären WebDAV Dateien tmp/>
    -l <required Ein Verzeichnis für die Logs logs/>
EOM

# default port
PORT=80

# Optionen parsen
while getopts "p:n:a:d:t:l:" OPTION; do
  case $OPTION in
    p) PORT=$OPTARG ;;
    n) NGINX_CONF=$OPTARG ;;
    a) APP=$OPTARG ;;
    d) DATA=$OPTARG ;;
    t) WEBDAV_TMP=$OPTARG ;;
    l) LOG=$OPTARG ;;
    *)
      echo "$HELP"
      exit 1 ;;
  esac
done

# Check required
if [ -z "$NGINX_CONF" ]; then
  echo "Pfad zu NGINX config ist erforderlich!"
  echo
  echo "$HELP"
  exit 1
fi

if [ -z "$APP" ]; then
  echo "Pfad zu der Applikation ist erforderlich!"
  echo
  echo "$HELP"
  exit 1
fi

if [ -z "$DATA" ]; then
  echo "Pfad zu den Daten ist erforderlich!"
  echo
  echo "$HELP"
  exit 1
fi

if [ -z "$WEBDAV_TMP" ]; then
  echo "Ein Verzeichnis für die temporären WebDAV Dateien ist erforderlich!"
  echo
  echo "$HELP"
  exit 1
fi

if [ -z "$LOG" ]; then
  echo "Ein Verzeichnis für die Logs ist erforderlich!"
  echo
  echo "$HELP"
  exit 1
fi

CONTAINER_NAME=tuteco-knowledge-base

echo "start container: ${CONTAINER_NAME}"
podman run -d --name ${CONTAINER_NAME} \
    -p "$PORT":80 \
    -v "$NGINX_CONF":/etc/nginx/nginx.conf:ro \
    -v "$APP":/var/tuteco-knowledge-base/app/ \
    -v "$DATA":/var/tuteco-knowledge-base/data/ \
    -v "$WEBDAV_TMP":/var/tmp/tuteco-knowledge-base/ \
    -v "$LOG":/var/log/nginx/ \
    docker.io/library/nginx

echo
podman ps