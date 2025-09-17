// GitHub API endpoint for fetching user activity
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const username = process.env.GITHUB_USERNAME || 'brettstark73';
    const token = process.env.GITHUB_TOKEN;
    
    const headers = {
      'User-Agent': 'about-brettstark-site',
      'Accept': 'application/vnd.github.v3+json',
    };
    
    if (token) {
      headers['Authorization'] = `token ${token}`;
    }

    // Fetch user info and repositories in parallel
    const [userResponse, reposResponse, eventsResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers }),
      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=3`, { headers }),
      fetch(`https://api.github.com/users/${username}/events/public?per_page=6`, { headers })
    ]);

    if (!userResponse.ok || !reposResponse.ok || !eventsResponse.ok) {
      throw new Error('Failed to fetch GitHub data');
    }

    const user = await userResponse.json();
    const repos = await reposResponse.json();
    const events = await eventsResponse.json();

    // Filter for meaningful commit events
    const recentCommits = events
      .filter(event => event.type === 'PushEvent')
      .slice(0, 3)
      .map(event => ({
        id: event.id,
        repo: event.repo.name,
        message: event.payload.commits[0]?.message || 'No commit message',
        date: event.created_at,
        url: `https://github.com/${event.repo.name}`
      }));

    // Format repository data
    const topRepos = repos.slice(0, 3).map(repo => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      url: repo.html_url,
      updated: repo.updated_at
    }));

    const data = {
      user: {
        name: user.name,
        login: user.login,
        avatar_url: user.avatar_url,
        public_repos: user.public_repos,
        followers: user.followers,
        following: user.following
      },
      repos: topRepos,
      commits: recentCommits,
      stats: {
        totalRepos: user.public_repos,
        totalCommits: recentCommits.length,
        languages: [...new Set(topRepos.map(repo => repo.language).filter(Boolean))].length,
        topLanguage: getTopLanguage(topRepos)
      }
    };

    res.status(200).json(data);
  } catch (error) {
    console.error('GitHub API Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch GitHub data',
      message: error.message 
    });
  }
}

function getTopLanguage(repos) {
  const languageCount = {};
  repos.forEach(repo => {
    if (repo.language) {
      languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
    }
  });
  
  const sortedLanguages = Object.entries(languageCount)
    .sort(([,a], [,b]) => b - a);
    
  return sortedLanguages[0]?.[0] || 'JavaScript';
}