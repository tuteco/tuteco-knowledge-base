# Tuteco Knowledge Base

## Prerequisites

Before getting started, make sure you have the following installed on your system:
  - Node.js
  - podman

The project was tested with Node.js v18.19.1 and podman v4.9.3.

## Deployment

- install npm packages
    ```shell
    npm install
    ```
 
- build application
    ```shell
    npm run build
    ```

- build image for helper scripts
    ```shell
    cd python_scripts
    podman build -t tuteco-knowledge-base-helper:v1 .
    ```

## Usage

- create the following tree structure in the project root
  - input
  - data
    - data 
    - structure 
  - logs
  - tmp
- copy project template folder from DEVONthink in input/$PROJECT_TEMPLATE_FOLDER
- convert project template data to topics and categories definitions
    ```shell
    ./infrastructure/convert_structure.sh -i ./input/$PROJECT_TEMPLATE_FOLDER/ -o ./data/structure/
    ```
- import script ./apple_scripts/ExportMarkdownDocumentation.applescript to DEVONthink scripts
- use this script to export markdown input data from DEVONthink in input/$MARKDOWN_DATA_FOLDER
- convert markdown input data to entities per category
    ```shell
    ./infrastructure/convert_data.sh -i ./input/$MARKDOWN_DATA_FOLDER/ -o ./data/data/ -c ./data/structure/category.json
    ```
- start web server
    ```shell
    ./infrastructure/run_nginx.sh -p $PORT -n ./infrastructure/nginx.conf -a ./dist/ -d ./data/ -t ./tmp/ -l ./logs/
    ```
- UI is now available
