from argparse import ArgumentParser
import json
import os.path
from typing import List, Dict

from core import Logger, clear_directory, list_directory_files

logger = Logger(__name__, 'info')

H1 = {
    'computer': {'fields': ['CsName'], 'template': '# {0}\n'}
}

OBJECT_TITLE = {
    'disk': {'fields': ['BusType', 'MediaType', 'Size GB'], 'template': '{0}-{1}({2})'},
    'network_adapter': {'fields': ['Name', 'MacAddress'], 'template': '{0}({1})'},
    'video_adapter': {'fields': ['VideoProcessor'], 'template': '{0}'},
    'ms_store': {'fields': ['Name', 'Version'], 'template': '{0}({1})'},
    'msi': {'fields': ['Caption', 'Version'], 'template': '{0}({1})'},
    'registry': {'fields': ['DisplayName', 'DisplayVersion'], 'template': '{0}({1})'},
}


def main():
    # parse arguments
    parser = ArgumentParser()
    parser.add_argument("customer")
    parser.add_argument("input_path")
    parser.add_argument("output_path")
    args = parser.parse_args()

    source_directory = str(os.path.join(args.input_path, args.customer))
    target_directory = prepare_target_directory(args.output_path, args.customer, clear=True)
    target_hardware_directory = prepare_target_directory(target_directory, 'hardware', clear=False)
    target_software_directory = prepare_target_directory(target_directory, 'software', clear=False)

    # list customer devices
    devices = [d for d in os.listdir(source_directory) if os.path.isdir(os.path.join(source_directory, d))]

    for device in devices:
        # device name
        h1 = []

        # processing device hardware and software information
        processing_device('hardware', source_directory, target_hardware_directory, device, h1)
        processing_device('software', source_directory, target_software_directory, device, h1)


def prepare_target_directory(base_path: str, path: str, clear: bool) -> str:
    target_directory = os.path.join(base_path, path)

    # create directories
    os.makedirs(target_directory, exist_ok=True)

    if clear:
        # clear target directory
        clear_directory(target_directory)

    return target_directory


def processing_device(information_type: str, source_path: str, target_path: str, device: str, h1: List[str]) -> None:
    # list json files
    source_directory = os.path.join(source_path, device, information_type)
    files = list_directory_files(source_directory, file_pattern=r"^.*\.json$")

    markdown_lines = []
    for file in files:
        logger.log.info(f'read file: {file}')
        try:
            with open(file, "r", encoding="utf-8") as json_file:
                json_data = json.load(json_file)

            filename = os.path.splitext(os.path.basename(file))[0]

            # build device name
            if H1.get(filename) and isinstance(json_data, dict):
                h1.append(H1[filename]['template'].format(
                    *[json_data.get(f, '') for f in H1[filename]['fields']]))

            if filename != 'computer':
                json_data = {filename.title(): json_data}

            if not isinstance(json_data, list):
                json_data = [json_data]

            markdown_lines.extend(json_to_markdown(json_data, OBJECT_TITLE.get(filename)))
        except Exception as e:
            logger.log.warning(e)

    markdown_file_name = os.path.join(target_path, f'{device}.md')
    logger.log.info(f'write file: {markdown_file_name}')

    with open(markdown_file_name, "w", encoding="utf-8") as markdown_file:
        markdown_file.write("\n".join(h1 + markdown_lines))


def json_to_markdown(json_data: List[Dict[str, any]], object_title: Dict[str, str | List[str]] | None, indent=0) -> \
        List[str]:
    markdown_lines = []
    indent_space = '    ' * indent

    for obj in json_data:
        for key, value in obj.items():
            if not isinstance(value, list):
                value = [value]

            for i, value_item in enumerate(value, start=1):
                if isinstance(value_item, dict):
                    # build object title
                    title = str(i)
                    if object_title:
                        title = object_title['template'].format(
                            *[value_item.get(f, '') for f in object_title['fields']])
                        if not title:
                            title = str(i)

                    markdown_lines.append(f"{indent_space}- __{key}:__ {title}")
                    markdown_lines.extend(json_to_markdown([value_item], object_title, indent + 1))
                else:
                    markdown_lines.append(f"{indent_space}- __{key}:__ {value_item}")

    return markdown_lines


if __name__ == "__main__":
    main()
