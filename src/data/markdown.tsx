export const howItWorks = `

## How it Works

Create a SFX Pack with a custom name, author and description using the form provided. Choose a pack type to specify if you are customizing either the Steam Deck’s background UI Music or the UI SFX (button clicks, menus, toggles … etc.)
 
**OR**

Import an SFX Pack. A valid SFX pack is a folder that contains a configuration file (pack.json) with the following information:

    {
    "name": "Your SFX Pack Name",
    "description": "Some text to describe your SFX Pack",
    "author": "SFX Pack Author Name",
    "version": "v1.0",
    "manifest_version": 2,
    "Music": false,
    "ignore": [],
    "mappings": {}
    }

Please refer to the official [AudioLoader plugin documentation](https://github.com/EMERALD0874/AudioLoader-PackDB) on GitHub for more information

\n &nbsp;

Once your SFX Pack is created, turn  up the volume and preview the default tracks or replace them with one (or many) custom tracks (.wav files for UI SFX packs and .mp3 for UI Music tracks)

\n &nbsp;

Keep in mind that if you add multiple replacements for a track, it will be randomized every time you visit or reload the main menu on the Steam Deck

\n &nbsp;

You can also import multiple tracks from an existing SFX pack folder (the replacement track filenames should match the file names for the default tracks)

\n &nbsp;

Once you are ready, download the complete SFX pack, unzip it, and drop it into your Steam Deck’s Audio Loader sounds folder located at /home/deck/homebrew/sounds

\n &nbsp;

*Additional download options are available*

`;