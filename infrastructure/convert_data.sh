#!/bin/bash

# help text
read -r -d '' HELP <<- EOM
  Benutzung: $0
    -i <required Input Pfad input/>
    -o <required Output Pfad structure/>
    -c <required Pfad zu den Kategoriendefinitionen category.json>
EOM

# Optionen parsen
while getopts "i:o:c:" OPTION; do
  case $OPTION in
    i) INPUT_PATH=$OPTARG ;;
    o) OUTPUT_PATH=$OPTARG ;;
    c) CATEGORIES=$OPTARG ;;
    *)
      echo "$HELP"
      exit 1 ;;
  esac
done

# Check required
if [ -z "$INPUT_PATH" ]; then
  echo "Input Pfad ist erforderlich!"
  echo
  echo "$HELP"
  exit 1
fi

if [ -z "$OUTPUT_PATH" ]; then
  echo "Output Pfad ist erforderlich!"
  echo
  echo "$HELP"
  exit 1
fi

if [ -z "$CATEGORIES" ]; then
  echo "Pfad zu den Kategoriendefinitionen ist erforderlich!"
  echo
  echo "$HELP"
  exit 1
fi

CONTAINER_NAME=tuteco-knowledge-base-convert-data

echo "start container: ${CONTAINER_NAME}"
podman run -d --name ${CONTAINER_NAME} \
    -v "$INPUT_PATH":/var/tuteco-knowledge-base/input/ \
    -v "$OUTPUT_PATH":/var/tuteco-knowledge-base/output/ \
    -v "$CATEGORIES":/var/tuteco-knowledge-base/category.json \
    localhost/tuteco-knowledge-base-helper:v1 \
    python scripts/convert_data.py /var/tuteco-knowledge-base/input/ /var/tuteco-knowledge-base/output/ /var/tuteco-knowledge-base/category.json

echo
podman ps