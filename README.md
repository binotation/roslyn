# Roslyn
Discord music bot which uses slash commands. See `src/commands/` for commands.

## Dependencies
- FFmpeg
- libtool (required for installing node-sodium)
- python-is-python3 (required for youtubedl-exec (node package))
- node packages

## Setup (Ubuntu)
1. Install the above dependencies
    - `sudo apt install ffmpeg`
    - `sudo apt-get install libtool`
    - `sudo apt install python-is-python3`
    - `npm i`
2. Build `npm run build`
3. Run search server `node search/search.js`
4. Start `node .` or `node dist/bot.js`
