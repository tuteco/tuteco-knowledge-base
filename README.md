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
    - script_data
  - output
    - script_data
  - data
    - data 
    - structure 
  - logs
  - tmp

- set customer identifier you used when collecting the customer data with helper scripts
    ```shell
    export CUSTOMER_ID=
    ```
- copy customer data collected by powershell script in input/script_data/$CUSTOMER_ID
- convert collected data to markdown files
    ```shell
    ./infrastructure/processing_script_data.sh -c $CUSTOMER_ID -i ./input/script_data/ -o ./output/script_data/
    ```
- copy converted markdown files from output/script_data/$CUSTOMER_ID to DEVONthink

- (ONCE by changes) set project template folder name as it is in DEVONthink
    ```shell
    export PROJECT_TEMPLATE_FOLDER=
    ```
- (ONCE by changes) copy project template folder from DEVONthink in input/$PROJECT_TEMPLATE_FOLDER
- (ONCE by changes) convert project template data to topics and categories definitions
    ```shell
    ./infrastructure/convert_structure.sh -i ./input/$PROJECT_TEMPLATE_FOLDER/ -o ./data/structure/
    ```
- (ONCE by changes) import script ./apple_scripts/ExportMarkdownDocumentation.applescript to DEVONthink scripts

- set customer markdown data folder name as it is in DEVONthink
    ```shell
    export CUSTOMER_MARKDOWN_DATA_FOLDER=
    ```
- use apple script to export customer markdown data from DEVONthink to input/$CUSTOMER_MARKDOWN_DATA_FOLDER
- convert customer markdown data to entities per category
    ```shell
    ./infrastructure/convert_data.sh -i ./input/$CUSTOMER_MARKDOWN_DATA_FOLDER/ -o ./data/data/ -c ./data/structure/category.json
    ```
- set exposed port and start web server
    ```shell
    export PORT=
    ./infrastructure/run_nginx.sh -p $PORT -n ./infrastructure/nginx.conf -a ./dist/ -d ./data/ -t ./tmp/ -l ./logs/
    ```
- UI is now available
