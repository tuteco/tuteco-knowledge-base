from argparse import ArgumentParser
from enum import Enum
import json
import os.path
from typing import Dict, List

from bs4 import BeautifulSoup
import markdown
from pydantic import BaseModel, Field

from core import Logger, clear_directory, list_directory_files

logger = Logger(__name__, 'info')


class LinkDirection(str, Enum):
    incoming = "incoming"
    outgoing = "outgoing"


class ExtendedValue(BaseModel):
    title: str
    content: str | List['Property']


class PropertyValue(BaseModel):
    type: str
    value: str | ExtendedValue


class Property(BaseModel):
    key: str
    value: List[PropertyValue]


class MetaLink(BaseModel):
    id: str
    name: str
    category: str


class Link(MetaLink):
    direction: LinkDirection
    type: str | None = None


class Meta(BaseModel):
    uuid: str
    category: str
    dataSourceName: str
    dataSourceType: str
    label: str | None = None
    tags: List[str] = Field([])
    i_links: List[MetaLink] = Field([])
    o_links: Dict[str, MetaLink] | None = None


class EntityMeta(BaseModel):
    dataSourceName: str
    dataSourceType: str
    label: str | None = None
    tags: List[str] = Field([])


class Entity(BaseModel):
    id: str
    name: str
    category: str
    properties: List[Property] = Field([])
    notes: Property | None = None
    links: List[Link] = Field([])
    meta: EntityMeta


class Category(BaseModel):
    description: str
    data: List[Entity] = Field([])


def main():
    # parse arguments
    parser = ArgumentParser()
    parser.add_argument("input_path")
    parser.add_argument("output_path")
    parser.add_argument("categories_path")
    args = parser.parse_args()

    # read categories
    categories = get_categories(args.categories_path)

    # clear target directory
    clear_directory(args.output_path)

    # list markdown files
    files = list_directory_files(args.input_path, file_pattern=r"^.*\.md$")

    for file in files:
        logger.log.info(f'read file {file}')

        # read file
        with open(file, "r", encoding="utf-8") as f:
            markdown_text = f.read()

        # convert to html with meta extension
        md = markdown.Markdown(extensions=["meta"])
        # html content without meta
        html_content = md.convert(markdown_text)

        # meta information
        if not md.Meta:
            logger.log.warning(f'meta data not found in {file}')
            continue

        meta = Meta(
            uuid=md.Meta['uuid'][0],
            category=md.Meta['category'][0],
            dataSourceName=md.Meta['data-source-name'][0],
            dataSourceType=md.Meta['data-source-type'][0],
            label=md.Meta.get('label', [None])[0],
            tags=md.Meta.get('tags', [])
        )

        # incoming links
        for link in md.Meta.get('ilinks', []):
            if len(l := link.split('|')) == 3:
                meta.i_links.append(MetaLink(id=l[2], name=l[1], category=l[0]))

        # outgoing links
        if md.Meta.get('olinks'):
            meta.o_links = {}
            for link in md.Meta['olinks']:
                if len(l := link.split('|')) == 4:
                    meta.o_links[l[3]] = MetaLink(id=l[2], name=l[1], category=l[0])

        if html_content:
            categories[meta.category].data.append(html_to_json(html_content, meta))

    for k, v in categories.items():
        with open(os.path.join(args.output_path, f'{k}.json'), "w", encoding="utf-8") as json_file:
            json.dump(
                [item.model_dump(exclude_none=True) for item in v.data],
                json_file,
                ensure_ascii=False,
                indent=4
            )


def get_categories(categories_path) -> Dict[str, Category]:
    # read categories
    try:
        with open(categories_path, "r", encoding="utf-8") as f:
            categories_from_file = json.load(f)
    except FileNotFoundError:
        logger.log.error(f'Category file not found {categories_path}')
        exit(1)

    return {c['id']: Category(description=c['description']) for c in categories_from_file}


def html_to_json(html_content: str, meta: Meta) -> Entity:
    # parse html
    soup = BeautifulSoup(html_content, "html.parser")

    try:
        check_allowed_tags(soup)
    except Exception as e:
        logger.log.error(e)
        exit(1)

    h1_tag = soup.find("h1")
    json_data = Entity(
        id=meta.uuid,
        name=h1_tag.get_text(),
        category=meta.category,
        meta=EntityMeta(**meta.model_dump())
    )

    json_data.properties = set_properties(h1_tag)

    h2_tags = soup.find_all("h2")
    # outgoing links
    if meta.o_links:
        for h2_tag in h2_tags:
            json_data.links += set_outgoing_links(h2_tag, meta.o_links)

    # incoming links
    for link in meta.i_links:
        json_data.links.append(Link(**link.model_dump(), direction=LinkDirection.incoming))

    h3_tag = soup.find("h3")
    if h3_tag:
        json_data.notes = set_notes(h3_tag)

    return json_data


def check_allowed_tags(soup):
    allowed_tags = ["h1", "h2", "h3", "ul", "li", "a", "p", "strong"]

    tags = [tag.name for tag in soup.find_all(True)]

    errors = []
    if "h1" not in tags:
        errors.append("tag missing: h1")

    if t := [tag for tag in tags if tag not in allowed_tags]:
        errors.append(f"unexpected tags: {', '.join(set(t))}")

    if errors:
        msg = "\n".join(errors)
        logger.log.error(msg)
        exit(1)


def set_properties(h1_tag) -> List[Property]:
    # only ul allowed
    ul = h1_tag.find_next_sibling("ul")
    if ul:
        return set_properties_recursive(ul)

    return []


def set_properties_recursive(ul) -> List[Property]:
    properties_dictionary = {}

    li = ul.find("li")
    while li:
        # get text key: value
        text = li.get_text().split(":")
        if not text:
            li = li.find_next_sibling('li')
            continue

        key = text[0]
        value = None
        if len(text) > 1:
            value = ':'.join(text[1:])

        # check nested list
        if ul_nested := li.find('ul'):
            if value:
                properties_dictionary.setdefault(key, [])
                properties_dictionary[key].append(
                    PropertyValue(type='nested', value=ExtendedValue(title=value.split('\n')[0].lstrip(),
                                                                     content=set_properties_recursive(ul_nested))))
        else:
            # check a-href
            if a := li.find("a"):
                if (title := a.get_text().lstrip()) and (link := a["href"]):
                    properties_dictionary.setdefault(key, [])
                    properties_dictionary[key].append(
                        PropertyValue(type='link', value=ExtendedValue(title=title, content=link)))
            elif value:
                # text value
                properties_dictionary.setdefault(key, [])
                properties_dictionary[key].append(PropertyValue(type='string', value=value.lstrip()))

        li = li.find_next_sibling('li')

    return [Property(key=k, value=v) for k, v in properties_dictionary.items()]


def set_outgoing_links(h2_tag, meta_o_links) -> List[Link]:
    links = []

    for sibling in h2_tag.find_next_siblings():
        if sibling.name in ["h2", "h3"]:
            break
        # only ul allowed
        if sibling.name == "ul":
            for li in sibling.find_all("li"):
                # only a-href allowed
                if (a := li.find("a")) and a["href"]:
                    link_name = os.path.splitext(os.path.basename(a["href"]))[0]
                    if link := meta_o_links.get(link_name):
                        links.append(
                            Link(**link.model_dump(), direction=LinkDirection.outgoing, type=h2_tag.get_text()))

    return links


def set_notes(h3_tag) -> Property | None:
    value = []

    for sibling in h3_tag.find_next_siblings():
        # p or ul allowed
        if sibling.name == "ul":
            for li in sibling.find_all("li"):
                value += [PropertyValue(type='string', value=line) for line in li.get_text().splitlines()]
        if sibling.name == "p":
            value += [PropertyValue(type='string', value=line) for line in sibling.get_text().splitlines()]

    if value:
        return Property(key=h3_tag.get_text(), value=value)
    else:
        return None


if __name__ == "__main__":
    main()
