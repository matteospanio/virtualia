# 🌿 Fresh Sound Shower | Virtualia

A static website for the **"Fresh Sound Shower"** tree installation — *Traspirazioni Sonore* by Vincenzo Guarnieri.

This project creates an interactive audio experience inspired by neuroscience studies on freshness perception and the natural transpiration of trees. The installation is designed to be placed under a tree, with speakers attached to branches that emit curated sounds, mimicking natural tree transpiration.

🔗 **Live Demo:** [https://matteospanio.github.io/virtualia/](https://matteospanio.github.io/virtualia/)

## 🎧 Features

- **Audio Playlist Player** with the following controls:
  - ▶️ Play / Pause
  - ⏭️ Next / ⏮️ Previous track
  - 🎚️ Seek within tracks (progress bar)
  - 🔁 Loop playlist option
  - 📋 Display current track information (title, artist)

- **Static & Lightweight:** Pure HTML, CSS, and JavaScript — no backend required
- **Cloud-Based Audio:** Streams songs directly from public URLs
- **Nature-Inspired Design:** Fresh, minimal aesthetic with greens, blues, and natural tones
- **Responsive Layout:** Works beautifully on desktop, tablet, and mobile devices
- **Keyboard Shortcuts:** Space to play/pause, arrow keys for navigation
- **Touch Support:** Full mobile and touch device compatibility

## 🚀 Quick Start

### Viewing the Website

Simply open `index.html` in a web browser, or visit the [live demo](https://matteospanio.github.io/virtualia/).

### Adding/Updating Songs

1. Open `playlist.json` in a text editor
2. Add or modify tracks using this format:

```json
[
    {
        "title": "Your Track Title",
        "artist": "Artist Name",
        "url": "https://your-cloud-link.com/audio.mp3"
    }
]
```

**Important Notes:**
- The `url` must be a **direct link** to an audio file (MP3, WAV, OGG, etc.)
- For Google Drive files:
  1. Share the file publicly
  2. Get the file ID from the sharing link
  3. Use this format: `https://drive.google.com/uc?export=download&id=FILE_ID`
- For other cloud services, ensure the URL directly serves the audio file

3. Save the file and refresh the page

### Example Playlist Entry

```json
[
    {
        "title": "Forest Breeze",
        "artist": "Nature Collective",
        "url": "https://drive.google.com/uc?export=download&id=1a2b3c4d5e6f7g8h9i0j"
    },
    {
        "title": "Tree Whispers",
        "artist": "Environmental Sounds",
        "url": "https://example.com/audio/tree-whispers.mp3"
    }
]
```

## 🌐 Deploying to GitHub Pages

This repository is already configured for GitHub Pages. The website is automatically deployed from the main branch.

### Manual Deployment Steps:

1. Go to your repository **Settings** → **Pages**
2. Under **Source**, select the branch (e.g., `main`)
3. Click **Save**
4. Your site will be available at: `https://[username].github.io/[repository-name]/`

## 🎨 Customization

### Changing Colors

Edit the CSS variables in `style.css`:

```css
:root {
    --color-primary: #4caf50; /* Main green */
    --color-secondary: #81c784; /* Light green */
    --color-accent: #66bb6a; /* Medium green */
    --color-wood: #5d4037; /* Wood brown */
    --color-sky: #e1f5fe; /* Light blue */
    --color-bg: #f1f8e9; /* Background */
}
```

### Adding Logos

In `index.html`, find the footer section with class `logos` and replace the placeholder:

```html
<div class="logos">
    <img src="logo1.png" alt="Partner 1" height="60">
    <img src="logo2.png" alt="Partner 2" height="60">
</div>
```

### Keyboard Shortcuts

- **Space** — Play/Pause
- **Right Arrow** — Next track
- **Left Arrow** — Previous track
- **L** — Toggle loop mode

## 📁 Project Structure

```
virtualia/
├── index.html          # Main HTML structure
├── style.css           # Styling and animations
├── script.js           # Audio player logic
├── playlist.json       # Song playlist data
├── README.md           # Documentation
└── LICENSE             # GPL-3.0 License
```

## 🔧 Technical Details

- **Audio API:** HTML5 `<audio>` element
- **Data Storage:** JSON file for playlist
- **Styling:** Pure CSS with CSS Grid and Flexbox
- **Animations:** CSS keyframe animations for nature effects
- **Compatibility:** Modern browsers (Chrome, Firefox, Safari, Edge)

## 🌱 About the Installation

**Traspirazioni Sonore** (Sound Transpirations) is an art installation by **Vincenzo Guarnieri** that merges ecological design, sound art, and human perception. The project uses music to enhance the natural cooling effect of trees, creating a "fresh sound shower" experience.

The website serves as the control interface for the installation, allowing visitors to interact with the curated soundscape.

Learn more: [Traspirazioni Sonore on UniversoUnito](https://universounito.it/evento/traspirazioni-sonore-installazione-di-vincenzo-guarnieri/)

## 📄 License

This project is licensed under the **GNU General Public License v3.0** - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 💡 Credits

- **Installation Artist:** Vincenzo Guarnieri
- **Web Development:** [Your Name/Organization]
- **Concept:** Inspired by neuroscience studies on freshness perception and natural tree transpiration

---

Made with 🌿 for the trees and nature
