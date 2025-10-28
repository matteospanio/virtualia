# How to Add Songs to the Playlist

This guide explains how to add your own audio files to the Fresh Sound Shower playlist.

## Quick Start

1. Upload your audio files to a cloud storage service (Google Drive, Dropbox, etc.)
2. Get public URLs for the files
3. Edit `playlist.json` to add your tracks
4. Test the website

## Step-by-Step Instructions

### Option 1: Using Google Drive

1. **Upload your audio file to Google Drive**
   - Supported formats: MP3, WAV, OGG, M4A
   - Keep file sizes reasonable for streaming (under 10MB recommended)

2. **Make the file publicly accessible**
   - Right-click the file → "Get link"
   - Change access to "Anyone with the link"
   - Copy the link (it will look like: `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`)

3. **Convert the Google Drive link to a direct download link**
   - Extract the FILE_ID from the link
   - Use this format: `https://drive.google.com/uc?export=download&id=FILE_ID`
   - Example:
     - Original: `https://drive.google.com/file/d/1a2b3c4d5e6f7g8h9i0j/view?usp=sharing`
     - Direct: `https://drive.google.com/uc?export=download&id=1a2b3c4d5e6f7g8h9i0j`

4. **Add to playlist.json**
   ```json
   {
       "title": "Forest Breeze",
       "artist": "Nature Sounds Collective",
       "url": "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID"
   }
   ```

### Option 2: Using Dropbox

1. **Upload to Dropbox**
2. **Get sharing link**
3. **Modify the link**
   - Change `www.dropbox.com` to `dl.dropboxusercontent.com`
   - Change `?dl=0` to `?dl=1`
   - Example:
     - Original: `https://www.dropbox.com/s/abc123/audio.mp3?dl=0`
     - Direct: `https://dl.dropboxusercontent.com/s/abc123/audio.mp3?dl=1`

### Option 3: Using Your Own Server

If you have your own web server or hosting:

1. Upload audio files to your server
2. Ensure files are publicly accessible
3. Use the direct URL to the file
   ```json
   {
       "title": "Tree Whispers",
       "artist": "Sound Artist",
       "url": "https://yourserver.com/audio/tree-whispers.mp3"
   }
   ```

### Option 4: Using Free Audio Hosting Services

Services like:
- **SoundCloud** (use download URL if enabled)
- **Internet Archive** (archive.org)
- **Bandcamp** (if artist allows downloads)

## Editing playlist.json

The playlist file is a simple JSON array. Here's the structure:

```json
[
    {
        "title": "Track Title",
        "artist": "Artist Name",
        "url": "https://direct-link-to-audio.mp3"
    },
    {
        "title": "Another Track",
        "artist": "Another Artist",
        "url": "https://another-link.mp3"
    }
]
```

### Important Notes:

- **Always use direct links** that point to the actual audio file
- **Test your links** by pasting them in a browser - they should download or play the audio directly
- **Use HTTPS links** when possible for better security
- **Keep track titles descriptive** for better user experience
- **Maintain proper JSON syntax** - don't forget commas between objects!

## Testing Your Changes

1. Open `index.html` in a web browser
2. Check if your tracks appear in the playlist
3. Try playing each track to ensure URLs work
4. Test on mobile devices if possible

## Troubleshooting

### "Error loading: Track Name"
- **Cause:** The URL is not accessible or not a direct link
- **Fix:** Verify the URL works by pasting it in a browser address bar

### Track doesn't appear in playlist
- **Cause:** JSON syntax error
- **Fix:** Validate your JSON using an online JSON validator (jsonlint.com)

### Playback is choppy
- **Cause:** File is too large or internet is slow
- **Fix:** Compress your audio files or use a better hosting service

### CORS errors in console
- **Cause:** Server doesn't allow cross-origin requests
- **Fix:** Use a different hosting service that supports CORS

## Example Complete Playlist

```json
[
    {
        "title": "Morning Dew",
        "artist": "Forest Ensemble",
        "url": "https://drive.google.com/uc?export=download&id=1abc123xyz"
    },
    {
        "title": "Rustling Leaves",
        "artist": "Nature Symphony",
        "url": "https://dl.dropboxusercontent.com/s/def456/rustling.mp3?dl=1"
    },
    {
        "title": "Gentle Rain",
        "artist": "Weather Sounds",
        "url": "https://example.com/audio/rain.mp3"
    },
    {
        "title": "Bird Song",
        "artist": "Wild Recordings",
        "url": "https://archive.org/download/birdsong/track.mp3"
    }
]
```

## Best Practices

1. **Organize your files** - Use consistent naming
2. **Test before deploying** - Always verify links work
3. **Backup your playlist** - Keep a copy of playlist.json
4. **Consider file sizes** - Smaller files load faster
5. **Use descriptive metadata** - Good titles and artist names improve UX
6. **Check licensing** - Ensure you have rights to use the audio

## Need Help?

- Check the browser console (F12) for error messages
- Verify your JSON syntax at [JSONLint](https://jsonlint.com/)
- Ensure your URLs are publicly accessible
- Test with a simple audio file first to verify the setup works
