# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal website based on LittleLink - a self-hosted link aggregation platform. The `index.html` is customized for the owner's personal use. It uses pure HTML/CSS with zero JavaScript dependencies.

## Development

**No build process required** - LittleLink is static HTML/CSS. Simply open `index.html` in a browser or use any HTTP server.

### Docker Development
```bash
docker compose -f docker/compose.yaml up  # Serves at http://localhost:8080
```

### Docker Production
```bash
docker build -f docker/Dockerfile -t littlelink:latest .
docker run -d --name littlelink -p 80:80 --restart always littlelink:latest
```

### Pre-commit Hooks
The project uses pre-commit hooks (`.pre-commit-config.yaml`) for:
- Trailing whitespace and end-of-file fixes
- YAML validation
- Secret scanning (gitleaks, talisman)

## Architecture

### CSS Structure
- **reset.css** - Minimal CSS reset
- **style.css** - Core layout, typography, and theme system using CSS custom properties
- **brands.css** - All branded button styles (100+ buttons)

### Theme System
Three theme classes on the `<body>` element:
- `theme-auto` - Follows system preference via `prefers-color-scheme`
- `theme-light` - Force light theme
- `theme-dark` - Force dark theme

## Creating Custom Buttons

When asked to create a button with specific text, icon, and color, use these templates:

### CSS Template (add to `css/brands.css`)
```css
/* Button Label */
.button-classname {
    --button-text: #FFFFFF;
    --button-background: #HexColor;
    --button-border: 1px solid #000000;  /* optional: use if contrast < 3.0:1 */
}
```

### HTML Template (add to `index.html`)
```html
<!-- Button Label -->
<a class="button button-classname" href="URL" target="_blank" rel="noopener" role="button"><img class="icon" aria-hidden="true" src="images/icons/iconname.svg" alt="Button Label icon">Button Label</a>
```

### Rules
- **Class name**: Derive from button label - lowercase, replace non-alphanumeric chars with dashes
- **Icon**: Place SVG in `images/icons/`, should be clear at 24x24px
- **Border stroke**: Add `--button-border` with `#000000` (black) or `#FFFFFF` (white) if button background has low contrast against light (#FFFFFF) or dark (#121212) theme backgrounds
- **Contrast requirements**: Text on button needs 4.5:1 ratio; button on theme background needs 3.0:1 ratio

## Key Files

| File | Purpose |
|------|---------|
| `index.html` | Owner's personal website (customized) |
| `index_littlelink.html` | Original LittleLink examples - reference for existing button styles (social networks, etc.) |
| `css/brands.css` | Branded button styles (100+ pre-built) |
| `css/style.css` | Core layout and theme system |
