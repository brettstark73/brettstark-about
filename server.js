import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { default as githubHandler } from './api/github.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

// GitHub API endpoint
app.get('/api/github', (req, res) => {
  return githubHandler.default(req, res);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});