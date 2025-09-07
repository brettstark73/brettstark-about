# Claude Code Project Configuration

## Project Overview
**Project Name:** Brett Stark About Me Site
**Type:** Static Website
**Tech Stack:** HTML5, CSS3, Vanilla JavaScript
**Purpose:** Professional about-me page showcasing Brett's career, AI ventures, and personal interests

## Development Commands
**Run Development Server:**
```bash
vercel dev
```

**Build Project:**
```bash
echo 'Static site - no build needed'
```

**Deploy to Production:**
```bash
vercel --prod
```

**Local Preview:**
```bash
# Open public/index.html in browser
# OR use any local server like:
# python -m http.server 8000 (from public/ directory)
```

## Project Structure
```
/
├── api/              # Serverless API endpoints
│   └── github.js     # GitHub activity API endpoint
├── public/           # All website files
│   ├── index.html    # Main homepage
│   ├── styles.css    # All styling
│   ├── 404.html      # Custom 404 page
│   ├── favicon.ico   # Site icon (currently empty)
│   ├── og-image.png  # Social media preview (currently empty)
│   └── site.webmanifest # PWA manifest
├── package.json      # Project metadata and scripts
├── vercel.json       # Vercel deployment configuration
├── robots.txt        # SEO robots file
├── sitemap.xml       # SEO sitemap
└── CLAUDE.md         # This file
```

## Key Files & Directories
- **Main Content:** public/index.html (single-page site)
- **Styling:** public/styles.css (all CSS in one file)
- **Configuration:** vercel.json (deployment settings)
- **SEO Files:** robots.txt, sitemap.xml
- **Assets:** favicon.ico, og-image.png (both need content)

## Development Guidelines
- **Code Style:** Clean, semantic HTML5 with modern CSS
- **CSS Architecture:** CSS custom properties, mobile-first responsive design
- **SEO Focus:** Rich meta tags, JSON-LD schema, accessibility features
- **Performance:** Optimized loading, preloaded resources

## Current Features
- **SEO Optimized:** Complete meta tags, Open Graph, Twitter Cards
- **Accessible:** Skip links, ARIA labels, keyboard navigation
- **Responsive:** Mobile-first design with breakpoints
- **Dark Mode:** Automatic system preference detection
- **Performance:** Preloaded CSS, optimized fonts
- **Analytics:** Plausible analytics integration
- **GitHub Activity:** Live feed of recent commits and repositories with serverless API

## Known Issues & TODOs
- **favicon.ico:** Currently empty (0 bytes) - needs actual icon
- **og-image.png:** Currently empty (0 bytes) - needs social preview image
- **404 page:** Basic styling - could match main site design better

## Content Sections
- **Hero:** Name, title, tagline, location
- **Professional Journey:** Career highlights and current role
- **AI Business Ventures:** AI Second Act newsletter and AI Builder Lab
- **Background & Interests:** Personal interests (running, photography, sailing)
- **Current Focus:** Professional growth and active lifestyle
- **Links:** Social media and project links
- **Contact:** Connection information
- **GitHub Activity:** Recent commits and repositories with tab-based interface

## Environment Variables

### GitHub API Integration
The GitHub activity feed requires these environment variables:

**Required:**
- `GITHUB_USERNAME` - GitHub username to fetch activity from (default: "brettstark73")

**Optional:**
- `GITHUB_TOKEN` - GitHub Personal Access Token for higher rate limits (server-side only)

**Local Development:**
```bash
# Create .env.local file (not committed to git)
GITHUB_USERNAME=brettstark73
GITHUB_TOKEN=ghp_your_token_here
```

**Vercel Deployment:**
Set environment variables in Vercel dashboard or using Vercel CLI:
```bash
vercel env add GITHUB_USERNAME
vercel env add GITHUB_TOKEN
```

**Note:** The GitHub token is only used server-side and never exposed to the browser. Without a token, the API has lower rate limits but still functions.

## Claude Code Preferences
- **Always preview changes** before suggesting edits
- **Maintain SEO features** - don't remove meta tags or structured data
- **Keep accessibility** - preserve skip links and ARIA labels
- **Follow existing CSS patterns** - use CSS custom properties
- **Mobile-first approach** - test responsive behavior
- **Performance conscious** - maintain fast loading times

## Helpful Context
- **Domain:** about.brettstark.com (hosted on Vercel)
- **Target Audience:** Professional contacts, potential collaborators
- **Brand Colors:** Primary: #4f46e5 (indigo), Gradient: #667eea to #764ba2
- **Typography:** Inter font family
- **Analytics:** Plausible (privacy-focused)
- **Deployment:** Vercel with custom domain

## Environment Setup
No environment variables required - fully static site.

**Local Development:**
1. Navigate to project directory
2. Run `vercel dev` for local server
3. Open browser to localhost:3000
4. Edit files in public/ directory

---
*Brett Stark's professional about-me site - showcasing 30+ years in tech and AI ventures*