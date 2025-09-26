# Brett Stark - About Me

Professional about-me page showcasing Brett's career in tech leadership, AI ventures, and personal interests.

## 🌐 Live Site

[about.brettstark.com](https://about.brettstark.com)

## ✨ Features

- **🔧 GitHub Integration** - Live repository and commit data
- **🏃‍♂️ Strava Integration** - Real running activity and stats
- **📰 Newsletter Stats** - AI Second Act publication metrics
- **📱 Responsive Design** - Mobile-first, accessible interface
- **🚀 Performance Optimized** - Fast loading, SEO-friendly
- **🎨 Professional Design** - Clean, modern aesthetic

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js serverless functions (Vercel)
- **APIs**: GitHub API, Strava API, Beehiiv API
- **Deployment**: Vercel with custom domain
- **Quality**: ESLint, Prettier, Stylelint, Husky pre-commit hooks

## 🏃‍♂️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run quality checks
npm run quality

# Deploy to production
npm run deploy
```

## 📁 Project Structure

```
/
├── api/              # Serverless API endpoints
│   ├── github.js     # GitHub activity feed
│   ├── strava.js     # Running data integration
│   └── beehiiv.js    # Newsletter statistics
├── public/           # Static website files
│   ├── index.html    # Main page
│   ├── styles.css    # All styling
│   └── assets/       # Images, icons, favicons
└── server.js         # Local development server
```

## 🔧 Environment Variables

Required for live data integration:

```bash
# GitHub (optional - higher rate limits)
GITHUB_USERNAME=brettstark73
GITHUB_TOKEN=your_github_token

# Strava (for live running data)
STRAVA_CLIENT_ID=your_client_id
STRAVA_CLIENT_SECRET=your_client_secret
STRAVA_REFRESH_TOKEN=your_refresh_token

# Beehiiv (for newsletter stats)
BEEHIIV_API_KEY=your_api_key
BEEHIIV_PUBLICATION_ID=your_publication_id
```

## 🎯 About Brett

**Tech Leader & AI Strategist** with 30+ years in engineering excellence. Director of Program Management leading 200+ staff and managing $1B+ product portfolios in automotive electronics.

**Current Ventures:**

- **AI Second Act** - Newsletter for mid-career AI transformation
- **AI Builder Lab** - AI tools and "vibe coding" education

**Interests:** Running (23min 5K), astrophotography, sailing, tennis

## 📄 License

This project showcases Brett Stark's professional work and personal brand. The code structure is provided as reference, but content and personal information remain proprietary.

---

**Built with ❤️ by Brett Stark**
