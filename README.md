# SOKO JARVIS

Personal assistant interface developed by SOKONSULTING.

## Project status

Early prototype based on the JARVIS 0.5 interface snapshot.
It includes a FastAPI static server and frontend interface.
It does not yet include an AI conversation backend, ChatGPT OAuth,
user accounts or persistent chat history.

## Features

- FastAPI static server
- HTML, CSS and JavaScript interface
- Holographic avatar
- Browser speech recognition where supported
- Docker build support

## Run with Docker

Build:

    docker build -t soko-jarvis:0.5.0 .

Run:

    docker run --rm -p 8000:8000 soko-jarvis:0.5.0

Open http://localhost:8000.

## Security

Never commit API keys, passwords, OAuth tokens, .env files,
production data, databases or private server configuration.

## Version note

The health endpoint still reports version 0.2.0,
although this interface snapshot is from JARVIS 0.5.

## License

MIT. See LICENSE.
