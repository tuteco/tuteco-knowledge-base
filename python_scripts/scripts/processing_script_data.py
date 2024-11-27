from argparse import ArgumentParser
import json
import os.path
from typing import Dict, List

from core import Logger, clear_directory, list_directory_files

logger = Logger(__name__, 'info')

H1 = {
    'computer': {'fields': ['CsName'], 'template': '# {0}\n'}
}

H2 = {
    'computer': {'fields': ['CsName'], 'template': '\n- [{0}]()'}
}

OBJECT_TITLE = {
    'processor': {'fields': ['Name'], 'template': '{0}'},
    'disk': {'fields': ['BusType', 'MediaType', 'Size GB'], 'template': '{0}-{1}({2}GB)'},
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
        # link
        h2 = ['\n## Software']
        processing_device('hardware', source_directory, target_hardware_directory, device, h1, h2)
        h2[0] = '\n## Hardware'
        processing_device('software', source_directory, target_software_directory, device, h1, h2)


def prepare_target_directory(base_path: str, path: str, clear: bool) -> str:
    target_directory = os.path.join(base_path, path)

    # create directories
    os.makedirs(target_directory, exist_ok=True)

    if clear:
        # clear target directory
        clear_directory(target_directory)

    return target_directory


def processing_device(information_type: str, source_path: str, target_path: str, device: str, h1: List[str], h2: List[str]) -> None:
    # list json files
    source_directory = os.path.join(source_path, device, information_type)
    files = list_directory_files(source_directory, file_pattern=r"^.*\.json$")

    markdown_lines = []
    processors: List[Dict[str, any]] | Dict[str, any] = []
    network_adapters: List[Dict[str, any]] | Dict[str, any] = []
    for file in files:
        logger.log.info(f'read file: {file}')
        try:
            with open(file, "r", encoding="utf-8") as json_file:
                json_data = json.load(json_file)

            filename = os.path.splitext(os.path.basename(file))[0]

            # build device name
            if H1.get(filename) and isinstance(json_data, dict):
                h1.append(H1[filename]['template'].format(
                    *[json_data.get(f) or '' for f in H1[filename]['fields']]))

            # build link
            if H2.get(filename) and isinstance(json_data, dict):
                h2.append(H2[filename]['template'].format(
                    *[json_data.get(f) or '' for f in H2[filename]['fields']]))

            # special logic
            if filename == 'computer':
                # save processor information
                processors = json_data.get('CsProcessors') or []
                if not isinstance(processors, list):
                    processors = [processors]
                # delete processor from computer
                del json_data['CsProcessors']

                # save logical network adapter information
                network_adapters = json_data.get('CsNetworkAdapters') or []
                if not isinstance(network_adapters, list):
                    network_adapters = [network_adapters]
                # delete logical network adapter information from computer
                del json_data['CsNetworkAdapters']
            else:
                if filename == 'dns':
                    if not isinstance(json_data, list):
                        json_data = [json_data]
                    # add DNS information to logical network adapter
                    for i, item in enumerate(json_data):
                        if not item.get('InterfaceAlias'):
                            continue
                        adapter_index = next(
                            (i for i, network_adapter in enumerate(network_adapters) if
                             network_adapter.get('ConnectionID') == item['InterfaceAlias']), None)
                        if adapter_index is not None:
                            network_adapters[adapter_index]['DNSServerAddresses'] = item.get('ServerAddresses')
                    # dont process dns file
                    continue

                if filename == 'network_adapter':
                    if not isinstance(json_data, list):
                        json_data = [json_data]
                    # add logical network adapter information to physical network adapter
                    for i, item in enumerate(json_data):
                        adapter_name = item.get('InterfaceAlias') or item.get('Name')
                        adapter = next((item for item in network_adapters if item.get('ConnectionID') == adapter_name),
                                       None)
                        if adapter:
                            for prop in ['DHCPEnabled', 'DHCPServer', 'IPAddresses', 'DNSServerAddresses']:
                                json_data[i][prop] = adapter.get(prop)

                # save as nested object
                json_data = {filename.title(): json_data}

            if not isinstance(json_data, list):
                json_data = [json_data]

            markdown_lines.extend(json_to_markdown(json_data, OBJECT_TITLE.get(filename)))

            # add processor information
            if filename == 'computer':
                markdown_lines.extend(json_to_markdown([{'Processors': processors}], OBJECT_TITLE.get('processor')))
        except Exception as e:
            logger.log.warning(e)

    markdown_file_name = os.path.join(target_path, f'{device}.md')
    logger.log.info(f'write file: {markdown_file_name}')

    with open(markdown_file_name, "w", encoding="utf-8") as markdown_file:
        markdown_file.write("\n".join(h1 + markdown_lines + h2))


def json_to_markdown(
        json_data: List[Dict[str, any]], object_title: Dict[str, str | List[str]] | None, indent=0) -> List[str]:
    markdown_lines = []
    indent_space = '    ' * indent

    for obj in json_data:
        for key, value in obj.items():
            if not isinstance(value, list):
                value = [value]

            for i, value_item in enumerate(value, start=1):
                if isinstance(value_item, dict):
                    # build object title
                    title = build_object_title(i, object_title, value_item)

                    markdown_lines.append(f"{indent_space}- __{key}:__ {title}")
                    markdown_lines.extend(json_to_markdown([value_item], object_title, indent + 1))
                else:
                    markdown_lines.append(f"{indent_space}- __{key}:__ {value_item}")

    return markdown_lines


def build_object_title(id: int, object_title: Dict[str, str | List[str]] | None, value: Dict[str, any]) -> str:
    # build object title
    title = ''
    if object_title:
        title = object_title['template'].format(*[value.get(f) or '' for f in object_title['fields']])

    if not title:
        title = str(id)

    return title


if __name__ == "__main__":
    main()
