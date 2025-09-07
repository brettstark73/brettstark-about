// GitHub Activity API Endpoint
// Environment setup:
// - Set GITHUB_USERNAME in vercel.json or environment
// - Optionally set GITHUB_TOKEN for higher rate limits (server-side only)

const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'brettstark73';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const CACHE_DURATION = 12 * 60 * 1000; // 12 minutes in milliseconds

// In-memory cache for serverless functions
const cache = new Map();

function generateContributionCalendar(events) {
  // Create a map of dates to contribution counts
  const contributionMap = new Map();
  
  // Process events from the last 12 weeks
  const now = new Date();
  const twelveWeeksAgo = new Date(now - (12 * 7 * 24 * 60 * 60 * 1000));
  
  // Count contributions by date
  events.forEach(event => {
    const eventDate = new Date(event.created_at);
    if (eventDate >= twelveWeeksAgo) {
      const dateKey = eventDate.toISOString().split('T')[0]; // YYYY-MM-DD
      
      // Count different event types as contributions
      if (['PushEvent', 'CreateEvent', 'PullRequestEvent', 'IssuesEvent'].includes(event.type)) {
        const currentCount = contributionMap.get(dateKey) || 0;
        contributionMap.set(dateKey, currentCount + 1);
      }
    }
  });
  
  // Generate calendar grid (12 weeks * 7 days = 84 days)
  const calendar = [];
  let totalContributions = 0;
  
  for (let i = 83; i >= 0; i--) {
    const date = new Date(now - (i * 24 * 60 * 60 * 1000));
    const dateKey = date.toISOString().split('T')[0];
    const count = contributionMap.get(dateKey) || 0;
    
    totalContributions += count;
    
    calendar.push({
      date: dateKey,
      count: count,
      level: getContributionLevel(count)
    });
  }
  
  return {
    calendar,
    totalContributions,
    weeks: 12
  };
}

function getContributionLevel(count) {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 4) return 2;
  if (count <= 6) return 3;
  return 4;
}

async function fetchGitHubData() {
  const headers = {
    'User-Agent': 'Brett-Stark-About-Me-Site',
    'Accept': 'application/vnd.github.v3+json'
  };

  if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`;
  }

  try {
    // Fetch recent events and repositories in parallel
    const [eventsResponse, reposResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=100`, { headers }),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`, { headers })
    ]);

    if (!eventsResponse.ok || !reposResponse.ok) {
      throw new Error('GitHub API request failed');
    }

    const [events, repos] = await Promise.all([
      eventsResponse.json(),
      reposResponse.json()
    ]);

    // Extract commits from PushEvent items
    const commits = [];
    for (const event of events) {
      if (event.type === 'PushEvent' && event.payload.commits && commits.length < 10) {
        for (const commit of event.payload.commits) {
          if (commits.length >= 10) break;
          
          commits.push({
            repo: event.repo.name,
            repoUrl: `https://github.com/${event.repo.name}`,
            message: commit.message.split('\n')[0].substring(0, 100), // First line, truncated
            timestamp: event.created_at,
            commitUrl: `https://github.com/${event.repo.name}/commit/${commit.sha}`
          });
        }
      }
    }

    // Format repositories data
    const formattedRepos = repos.map(repo => ({
      name: repo.name,
      description: repo.description ? repo.description.substring(0, 120) : 'No description available',
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      updatedAt: repo.updated_at,
      htmlUrl: repo.html_url,
      language: repo.language
    }));

    // Generate contribution calendar data (last 12 weeks)
    const contributionData = generateContributionCalendar(events);

    return {
      commits: commits.slice(0, 10),
      repos: formattedRepos.slice(0, 6),
      contributions: contributionData,
      error: false
    };

  } catch (error) {
    console.error('GitHub API Error:', error);
    return {
      commits: [],
      repos: [],
      contributions: { calendar: [], totalContributions: 0, weeks: 12 },
      error: true,
      message: 'Unable to fetch GitHub data'
    };
  }
}

function getCachedData() {
  const cached = cache.get('github-data');
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

function setCacheData(data) {
  cache.set('github-data', {
    data,
    timestamp: Date.now()
  });
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check cache first
    let data = getCachedData();
    
    if (!data) {
      // Fetch fresh data if not cached
      data = await fetchGitHubData();
      setCacheData(data);
    }

    // Set cache headers for client-side caching
    res.setHeader('Cache-Control', 'public, max-age=600, stale-while-revalidate=300'); // 10 min cache
    
    return res.status(200).json(data);

  } catch (error) {
    console.error('API Handler Error:', error);
    return res.status(500).json({
      commits: [],
      repos: [],
      error: true,
      message: 'Server error'
    });
  }
}