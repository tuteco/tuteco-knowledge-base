from argparse import ArgumentParser
import json
import os.path
from typing import List

from bs4 import BeautifulSoup
import markdown
from pydantic import BaseModel, Field

from core import Logger, list_directory_files, clear_directory

logger = Logger(__name__, 'info')


class Topic(BaseModel):
    id: str
    description: str
    icon: str


class Category(BaseModel):
    id: str
    description: str
    icon: str


class JsonContent(BaseModel):
    topic: List[Topic] = Field([])
    category: List[Category] = Field([])


def main():
    # parse arguments
    parser = ArgumentParser()
    parser.add_argument("input_path")
    parser.add_argument("output_path")
    args = parser.parse_args()

    # clear target directory
    clear_directory(args.output_path)

    json_content = JsonContent()

    # list icon files
    files = list_directory_files(args.input_path, file_pattern=r"^.*_icon\.md$")

    for file in files:
        logger.log.info(f'read file {file}')

        # read file
        with open(file, "r", encoding="utf-8") as f:
            markdown_text = f.read()

        # convert to html
        md = markdown.Markdown()
        html_content = md.convert(markdown_text)

        # is it topic or category
        file_name = os.path.basename(file)
        if len(file_name) == 9:
            obj = Topic(id=file_name[:1], description=file.split('/')[-2][2:], icon='')
        elif len(file_name) == 12:
            obj = Category(id=file_name[:4], description=file.split('/')[-2][5:], icon='')
        else:
            continue

        # parse html
        soup = BeautifulSoup(html_content, "html.parser")

        try:
            check_allowed_tags(soup)
        except Exception as e:
            logger.log.error(e)
            exit(1)

        obj.icon = soup.find('a').get_text()

        if isinstance(obj, Topic):
            json_content.topic.append(obj)
        elif isinstance(obj, Category):
            json_content.category.append(obj)

    save_json_file(args.output_path + '/topic.json', json_content.topic)
    save_json_file(args.output_path + '/category.json', json_content.category)


def check_allowed_tags(soup):
    allowed_tags = ["a", "p"]

    tags = [tag.name for tag in soup.find_all(True)]

    errors = []
    if t := [tag for tag in tags if tag not in allowed_tags]:
        errors.append(f"unexpected tags: {', '.join(set(t))}")

    if errors:
        msg = "\n".join(errors)
        logger.log.error(msg)
        exit(1)


def save_json_file(file_name, json_content):
    if json_content:
        with open(file_name, "w", encoding="utf-8") as json_file:
            json.dump(
                [obj.model_dump(exclude_none=True) for obj in json_content],
                json_file,
                ensure_ascii=False,
                indent=4
            )


if __name__ == "__main__":
    main()
