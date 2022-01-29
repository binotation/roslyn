# Roslyn
This is a private discord music bot with plans for multi-purpose functionality in the future.

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
3. Start `node .` or `node dist/bot.js`
