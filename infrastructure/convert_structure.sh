#!/bin/bash

# help text
read -r -d '' HELP <<- EOM
  Benutzung: $0
    -i <required Input Pfad input/>
    -o <required Output Pfad structure/>
EOM

# Optionen parsen
while getopts "i:o:" OPTION; do
  case $OPTION in
    i) INPUT_PATH=$OPTARG ;;
    o) OUTPUT_PATH=$OPTARG ;;
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

CONTAINER_NAME=tuteco-knowledge-base-convert-structure

echo "start container: ${CONTAINER_NAME}"
podman run -d --name ${CONTAINER_NAME} \
    -v "$INPUT_PATH":/var/tuteco-knowledge-base/input/ \
    -v "$OUTPUT_PATH":/var/tuteco-knowledge-base/output/ \
    localhost/tuteco-knowledge-base-helper:v1 \
    python scripts/convert_structure.py /var/tuteco-knowledge-base/input/ /var/tuteco-knowledge-base/output/

echo
podman ps