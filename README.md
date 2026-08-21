# Art Site

A personal art portfolio and experiments website built with [Hugo](https://gohugo.io/), showcasing generative art projects and creative coding experiments.

🌐 **Live Site**: [https://art.berk.es](https://art.berk.es)

## About

This is Bèr `berkes` Kessels' art experiments portfolio, featuring various generative art projects and creative coding works including:

- Digital Garden - Generate unique mazes based on custom names
- Robot Finds Kitten
- Robot Finds Chicken
- Lost in Love
- Space Garden

## Technology Stack

- **Static Site Generator**: [Hugo](https://gohugo.io/) (v0.151.0)
- **Containerization**: Podman for local development
- **Web Server**: [static-web-server](https://github.com/joseluisq/static-web-server) for production
- **Deployment**: Scaleway Object Storage via GitHub Actions
- **CI/CD**: GitHub Actions

## Prerequisites

- [Podman](https://podman.io/) (or Docker with minor modifications to Justfile)
- [just](https://github.com/casey/just)

## Getting Started

### Installation

Verify Hugo is available:

```bash
just install
```

### Local Development

Run a local development server with live reload:

```bash
just preview
```

The site will be available at `http://localhost:8080`

### Building

Build the static site for production:

```bash
just build
```

The built site will be generated in the `public/` directory.

### Cleaning

Remove generated files:

```bash
just clean
```

## Project Structure

```
art-site/
├── archetypes/       # Content templates
├── assets/           # Assets to be processed (SCSS, JS, etc.)
├── content/          # Content files (Markdown)
│   ├── notes/        # Notes and blog posts
│   ├── work/         # Portfolio work items
│   └── about.md      # About page
├── data/             # Data files
├── i18n/             # Internationalization
├── layouts/          # HTML templates
├── public/           # Generated site (git-ignored)
├── static/           # Static assets (images, etc.)
└── hugo.toml         # Hugo configuration
```

## Deployment

Deployment is automated through GitHub Actions. Simply push to the `main` branch:

```bash
git push origin main
```

The CI pipeline will:
1. Build the Hugo site with minification
2. Upload the build artifact
3. Deploy to Scaleway Object Storage

### Manual Deployment

```bash
just deploy
```

Note: This will remind you that deployment is handled by CI/CD.

## Configuration

Site configuration is managed in `hugo.toml`:

- **Base URL**: `https://art.berk.es`
- **Language**: English (en-us)
- **Title**: Bèr `berkes` Kessels' art experiments

## Docker/Podman

The project uses Podman for containerized builds. All Hugo commands run inside the `hugomods/hugo` container to ensure consistent builds across environments.

## Contributing

This is a personal portfolio site, but suggestions and bug reports are welcome via issues.

## License

Content and code © Bèr Kessels. All rights reserved.

## Author

**Bèr `berkes` Kessels**

- Website: [https://art.berk.es](https://art.berk.es)