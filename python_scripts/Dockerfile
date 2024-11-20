FROM python:3.12-slim

 # install poetry
RUN apt-get -y update -y \
 && apt-get install -y --no-install-recommends curl \
 && curl -sSL https://install.python-poetry.org | POETRY_VERSION=1.8.2 POETRY_HOME=/usr/local POETRY_VIRTUALENVS_IN_PROJECT=true python - \
 && apt-get clean -y && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY ./pyproject.toml ./poetry.toml ./poetry.lock ./

# install python packages
RUN poetry install --no-root --only main

# copy code
COPY ./core ./core
COPY ./scripts ./scripts

# set environment variables
ENV PATH="/app/.venv/bin:$PATH" PYTHONPATH=/app