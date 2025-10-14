// Strava API endpoint for fetching user activities
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
    let accessToken = null;
    const refreshToken = process.env.STRAVA_REFRESH_TOKEN;
    const clientId = process.env.STRAVA_CLIENT_ID;
    const clientSecret = process.env.STRAVA_CLIENT_SECRET;

    // Always try to refresh the token if we have refresh credentials
    // (Strava tokens expire every 6 hours, so always get a fresh one)
    if (refreshToken && clientId && clientSecret) {
      try {
        const formData = new URLSearchParams();
        formData.append('client_id', clientId);
        formData.append('client_secret', clientSecret);
        formData.append('grant_type', 'refresh_token');
        formData.append('refresh_token', refreshToken);

        const refreshResponse = await fetch('https://www.strava.com/oauth/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData,
        });

        if (refreshResponse.ok) {
          const tokenData = await refreshResponse.json();
          accessToken = tokenData.access_token;
          // Note: The refresh_token from response should replace the old one if it changes
        } else {
          // eslint-disable-next-line no-console
          const errorText = await refreshResponse.text();
          // eslint-disable-next-line no-console
          console.error('Token refresh failed with status:', refreshResponse.status, errorText);
        }
      } catch (refreshError) {
        // eslint-disable-next-line no-console
        console.error('Token refresh exception:', refreshError);
      }
    }

    if (!accessToken) {
      // Return mock data when no token is available
      const mockData = {
        athlete: {
          id: 'brett_stark',
          firstname: 'Brett',
          lastname: 'Stark',
          profile_medium: null,
          city: 'Libertyville',
          state: 'Illinois',
          country: 'United States',
        },
        activities: [
          {
            id: 1,
            name: 'Morning Run',
            type: 'Run',
            distance: 5.2,
            moving_time: 1380, // 23 minutes
            total_elevation_gain: 45,
            start_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            average_speed: 3.77,
          },
          {
            id: 2,
            name: 'Track Workout',
            type: 'Run',
            distance: 8.0,
            moving_time: 2400, // 40 minutes
            total_elevation_gain: 12,
            start_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            average_speed: 3.33,
          },
          {
            id: 3,
            name: 'Long Run',
            type: 'Run',
            distance: 15.5,
            moving_time: 4800, // 80 minutes
            total_elevation_gain: 120,
            start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            average_speed: 3.23,
          },
        ],
        stats: {
          totalActivities: 3,
          totalDistance: 28.7,
          totalTime: 8580,
          avgPace: '5:12', // min/km
          weeklyDistance: 28.7,
        },
        isLive: false,
      };

      // Cache mock for 10 minutes to keep UI stable
      res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');
      res.status(200).json(mockData);
      return;
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    };

    // Fetch athlete info and recent activities
    const [athleteResponse, activitiesResponse] = await Promise.all([
      fetch('https://www.strava.com/api/v3/athlete', { headers }),
      fetch('https://www.strava.com/api/v3/athlete/activities?per_page=5', { headers }),
    ]);

    if (!athleteResponse.ok || !activitiesResponse.ok) {
      throw new Error('Failed to fetch Strava data');
    }

    const athlete = await athleteResponse.json();
    const activities = await activitiesResponse.json();

    // Calculate stats for this week (last 7 days)
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const thisWeekActivities = activities.filter(
      (activity) => new Date(activity.start_date) > oneWeekAgo && activity.type === 'Run'
    );

    const weeklyDistance = thisWeekActivities.reduce(
      (sum, activity) => sum + activity.distance / 1000,
      0
    );
    const totalDistance = activities.reduce((sum, activity) => sum + activity.distance / 1000, 0);
    const totalTime = activities.reduce((sum, activity) => sum + activity.moving_time, 0);

    // Calculate average pace from recent runs (seconds per km)
    const recentRuns = activities.filter((activity) => activity.type === 'Run').slice(0, 3);
    let avgPaceSeconds = 0;
    if (recentRuns.length > 0) {
      const totalRunTime = recentRuns.reduce((sum, run) => sum + run.moving_time, 0);
      const totalRunDistance = recentRuns.reduce((sum, run) => sum + run.distance / 1000, 0);
      avgPaceSeconds = totalRunDistance > 0 ? totalRunTime / totalRunDistance : 0;
    }
    const avgPace = avgPaceSeconds > 0 ? formatPace(avgPaceSeconds) : '0:00';

    const data = {
      athlete: {
        id: athlete.id,
        firstname: athlete.firstname,
        lastname: athlete.lastname,
        profile_medium: athlete.profile_medium,
        city: athlete.city,
        state: athlete.state,
        country: athlete.country,
      },
      activities: activities.map((activity) => ({
        id: activity.id,
        name: activity.name,
        type: activity.type,
        distance: Math.round((activity.distance / 1000) * 10) / 10, // km, 1 decimal
        moving_time: activity.moving_time,
        total_elevation_gain: activity.total_elevation_gain,
        start_date: activity.start_date,
        average_speed: activity.average_speed,
      })),
      stats: {
        totalActivities: activities.length,
        totalDistance: Math.round(totalDistance * 10) / 10,
        totalTime: totalTime,
        avgPace: avgPace,
        weeklyDistance: Math.round(weeklyDistance * 10) / 10,
      },
      isLive: true,
    };

    // Cache live data for 10 minutes
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');
    res.status(200).json(data);
  } catch (error) {
    // console.error('Strava API Error:', error);
    res.status(500).json({
      error: 'Failed to fetch Strava data',
      message: error.message,
    });
  }
}

function formatPace(secondsPerKm) {
  // secondsPerKm is already seconds per kilometer
  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = Math.floor(secondsPerKm % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
