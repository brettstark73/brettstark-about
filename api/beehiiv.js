// Beehiiv Newsletter Stats API
// Serverless function to fetch AI Second Act newsletter statistics

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const publicationId = process.env.BEEHIIV_PUBLICATION_ID;
    const apiKey = process.env.BEEHIIV_API_KEY;

    // Return fallback data if environment variables are not set
    if (!apiKey || !publicationId) {
      console.log('Beehiiv API credentials not configured, returning fallback data');
      return res.status(200).json({
        subscriberCount: 850,
        totalPosts: 24,
        publicationName: 'AI Second Act',
        description: 'Newsletter for mid-career AI transformation',
        url: 'https://aisecondact.beehiiv.com',
        lastUpdated: new Date().toISOString(),
        isLive: false
      });
    }

    // Fetch publication data from Beehiiv API
    const response = await fetch(`https://api.beehiiv.com/v2/publications/${publicationId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Beehiiv API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Extract and format stats
    const stats = {
      subscriberCount: data.subscriber_count || 0,
      totalPosts: data.total_posts || 0,
      publicationName: data.name || 'AI Second Act',
      description: data.description || 'Newsletter for mid-career AI transformation',
      url: data.url || 'https://aisecondact.beehiiv.com',
      lastUpdated: new Date().toISOString(),
      isLive: true
    };

    // Cache for 30 minutes
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate');
    
    res.status(200).json(stats);
    
  } catch (error) {
    console.error('Beehiiv API error:', error);
    
    // Return fallback data on error
    res.status(200).json({
      subscriberCount: 850,
      totalPosts: 24,
      publicationName: 'AI Second Act',
      description: 'Newsletter for mid-career AI transformation',
      url: 'https://aisecondact.beehiiv.com',
      lastUpdated: new Date().toISOString(),
      isLive: false,
      error: 'Unable to fetch live stats'
    });
  }
}