import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import axios from "axios";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
  "Access-Control-Allow-Methods": "GET, OPTIONS"
};

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: ""
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== "GET") {
    return {
      headers: corsHeaders,
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  const DISCOGS_TOKEN = process.env.DISCOGS_TOKEN || "ZVQpZIZeFkvNaxSKslHgiAEhhwpvwSfXKLJQiXGA";
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || "AIzaSyBEYhVFn2QDsumv32BjOBVg89OpUYRzWTk";

  async function searchYouTube(query: string, type: 'video' | 'playlist' = 'video') {
    try {
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
        params: {
          part: 'snippet',
          q: query,
          type: type,
          key: YOUTUBE_API_KEY,
          maxResults: 1
        }
      });
      return response.data.items[0];
    } catch (error) {
      console.error("YouTube API Error:", error);
      return null;
    }
  }

  try {
    const { genre, style, year, country, type = 'release' } = event.queryStringParameters || {};

    console.log(`Searching with: genre=${genre}, style=${style}, year=${year}, country=${country}`);

    // Step 1: Get total count for the search query
    const searchParams = new URLSearchParams({
      token: DISCOGS_TOKEN,
      type: type as string,
      format: 'album',
      per_page: '1',
    });

    if (genre) searchParams.append('genre', genre);
    if (style) searchParams.append('style', style);
    if (country) searchParams.append('country', country);

    // Handle decade selection
    if (year) {
      if (year.toString().length === 3) {
        // If it's a decade (e.g., "198"), add a random digit (0-9)
        const randomYear = Math.floor(Math.random() * 10) + parseInt(year.toString() + "0");
        searchParams.append('year', randomYear.toString());
      } else {
        searchParams.append('year', year);
      }
    }

    const searchUrl = `https://api.discogs.com/database/search?${searchParams.toString()}`;

    // Initial request to get pagination data
    const initialResponse = await axios.get(searchUrl, {
      headers: { 'User-Agent': 'DiscogsRandomizer/1.0' }
    });

    const totalItems = initialResponse.data.pagination.items;
    if (totalItems === 0) {
      return {
        headers: corsHeaders,
        statusCode: 404,
        body: JSON.stringify({ error: "No releases found with these filters." }),
      };
    }

    // Discogs API limits access to the first 10,000 items
    const maxItems = Math.min(totalItems, 10000);
    let attempts = 0;
    const MAX_ATTEMPTS = 10;

    while (attempts < MAX_ATTEMPTS) {
      attempts++;
      const randomPage = Math.floor(Math.random() * maxItems) + 1;

      try {
        const randomResponse = await axios.get(`${searchUrl}&page=${randomPage}`, {
          headers: { 'User-Agent': 'DiscogsRandomizer/1.0' }
        });

        const release = randomResponse.data.results?.[0];
        if (release && release.id) {
          // Fetch full details to check for videos
          const detailsResponse = await axios.get(`https://api.discogs.com/releases/${release.id}?token=${DISCOGS_TOKEN}`, {
            headers: { 'User-Agent': 'DiscogsRandomizer/1.0' }
          });

          const fullRelease = detailsResponse.data;

          // Try to find a YouTube playlist first
          const artist = fullRelease.artists?.[0]?.name || "";
          const title = fullRelease.title || "";
          const query = `${artist} - ${title}`;

          let youtubeData = null;

          // 1. Search for a playlist
          const playlist = await searchYouTube(query, 'playlist');
          if (playlist) {
            youtubeData = { type: 'playlist', id: playlist.id.playlistId };
          } else {
            // 2. If no playlist, check Discogs videos
            if (fullRelease.videos && fullRelease.videos.length > 0) {
              // Extract IDs from Discogs videos
              const videoIds = fullRelease.videos.map((v: any) => {
                // Handle standard watch URLs and short URLs
                const match = v.uri.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})(?:&|\?|$)/);
                return match ? match[1] : null;
              }).filter(Boolean);

              if (videoIds.length > 0) {
                youtubeData = { type: 'videos', ids: videoIds };
              }
            }

            // 3. If still no videos, search for the first track or album video
            if (!youtubeData) {
              const video = await searchYouTube(query, 'video');
              if (video) {
                youtubeData = { type: 'videos', ids: [video.id.videoId] };
              }
            }
          }

          if (youtubeData) {
            console.log(`Found release with YouTube content after ${attempts} attempts: ${fullRelease.title}`);
            return {
              headers: corsHeaders,
              statusCode: 200,
              body: JSON.stringify({ ...fullRelease, youtube: youtubeData }),
            };
          }
        }
      } catch (innerError) {
        console.warn(`Attempt ${attempts} failed`, innerError);
        // Continue to next attempt
      }
    }

    return {
      headers: corsHeaders,
      statusCode: 404,
      body: JSON.stringify({ error: "Could not find a release with YouTube links after several attempts. Try different filters." }),
    };

  } catch (error: any) {
    const errorData = error.response?.data;
    console.error("Discogs API Error:", errorData || error.message);

    if (errorData?.message === "You are making requests too quickly.") {
      return {
        headers: corsHeaders,
        statusCode: 429,
        body: JSON.stringify({ error: "Discogs rate limit exceeded. Please wait a moment." }),
      };
    }

    return {
      headers: corsHeaders,
      statusCode: 500,
      body: JSON.stringify({ error: errorData?.message || "Failed to fetch from Discogs." }),
    };
  }
};

export { handler };
