# Soriya Mut — Developer Portfolio V2

A futuristic, interactive personal portfolio website inspired by a developer command center. Built with pure HTML5, CSS3, Vanilla JavaScript, and JSON — no frameworks, no build tools, no dependencies.

## ✦ Features

- **JSON-driven content** — All portfolio data stored in editable JSON files
- **Remote image URLs** — Use any image URL in JSON (JPG, PNG, WebP, GIF)
- **Image fallbacks** — Beautiful placeholder when no image is provided or URL fails
- **Boot sequence** — System startup animation on page load
- **Animated background** — Canvas particles, gradient blobs, digital grid
- **Mouse interactions** — Cursor glow, card tilt, magnetic buttons
- **Scroll animations** — IntersectionObserver reveal with staggered cards
- **Developer terminal** — Interactive command-line with typing animation
- **Live system HUD** — Floating developer status panel
- **Timeline** — Animated journey timeline with growing line
- **Theme switcher** — Dark / Light mode with localStorage
- **Language switcher** — English / Khmer (ខ្មែរ) with JSON translations
- **Responsive** — Desktop, tablet, mobile, touch-optimized
- **Accessible** — Keyboard navigation, ARIA labels, reduced motion
- **SEO-ready** — Meta tags, Open Graph, Twitter cards, JSON-LD, sitemap

## ✦ Project Structure

```
portfolio/
├── index.html
├── data/
│   ├── profile.json        # Personal info, about section
│   ├── skills.json         # Tech arsenal
│   ├── projects.json       # Project showcase
│   ├── journey.json        # Timeline entries
│   ├── achievements.json   # Milestones (empty = loading state)
│   ├── traits.json         # Personality traits
│   ├── social.json         # Contact & social links
│   ├── settings.json       # HUD, terminal, boot config
│   ├── en.json             # English translations
│   └── km.json             # Khmer translations
├── assets/
│   ├── css/
│   │   ├── style.css       # Main styles, variables, components
│   │   ├── responsive.css  # Media queries
│   │   └── animations.css  # Keyframes & animation classes
│   ├── js/
│   │   ├── data-loader.js  # JSON loading & DOM population
│   │   ├── animations.js   # Background, scroll, visual effects
│   │   ├── interactions.js # Mouse, terminal, theme, micro-UX
│   │   └── app.js          # Boot sequence & initialization
│   └── images/
│       ├── profile/
│       ├── projects/
│       ├── background/
│       └── icons/
│           └── logo-portfolio.png
├── robots.txt
├── sitemap.xml
└── README.md
```

## ✦ How to Edit Content

All content is controlled by JSON files in the `data/` directory. Simply edit the JSON and refresh — no code changes needed.

### Profile Image

In `data/profile.json`, set the `profileImage` field to a URL:

```json
{
    "profileImage": "https://example.com/my-photo.jpg"
}
```

If empty, a styled placeholder is shown automatically.

### Project Images

In `data/projects.json`, set the `image` field:

```json
{
    "title": "My Project",
    "image": "https://example.com/screenshot.png",
    ...
}
```

### Social Links

In `data/social.json`, set the `url` field for each social. Empty URLs hide the link as disabled.

## ✦ How to Run

### Option 1: Local Server

```bash
# Python
python3 -m http.server 8000

# Or Node.js
npx serve

# Then open http://localhost:8000
```

> **Note:** You must serve via a local server (not `file://`) because `fetch()` requires HTTP.

### Option 2: Deploy

Deploy to any static host:
- GitHub Pages
- Vercel
- Netlify
- Cloudflare Pages

## ✦ Tech Stack

- HTML5 (semantic)
- CSS3 (custom properties, grid, flexbox)
- Vanilla JavaScript (ES6+, no dependencies)
- JSON (data storage)
- Google Fonts (Space Grotesk, JetBrains Mono, Khmer Battambang)

## ✦ Browser Support

- Chrome / Edge 90+
- Firefox 88+
- Safari 14+

## ✦ License

Personal portfolio for Soriya Mut. BUILD • LEARN • GROW.
