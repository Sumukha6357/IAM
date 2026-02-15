# Local Development

## Core (db + api)
- docker compose --profile core up --build

## Full (db + api + web)
- docker compose --profile full up --build

## Run web locally (optional)
- docker compose --profile core up --build
- cd web && npm run dev
