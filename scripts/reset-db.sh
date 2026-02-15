#!/usr/bin/env bash
set -e
docker compose down -v
docker compose --profile core up --build
