import express from 'express';
import githubHandler from './api/github.js';
import stravaHandler from './api/strava.js';
import beehiivHandler from './api/beehiiv.js';

const app = express();
const port = 3000;

// Serve static files from the public directory
app.use(express.static('public'));

// Set CORS headers for all responses
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-GitHub-Token');
  next();
});

// API endpoints
app.get('/api/github', githubHandler);
app.get('/api/strava', stravaHandler);
app.get('/api/beehiiv', beehiivHandler);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running at http://localhost:${port}`);
});
