import axios from "axios";

// API Configuration
const GNEWS_API_KEY = process.env.EXPO_PUBLIC_GNEWS_API_KEY || "";
const UNSPLASH_ACCESS_KEY = process.env.EXPO_PUBLIC_UNSPLASH_ACCESS_KEY || "";

const GNEWS_BASE_URL = "https://gnews.io/api/v4";
const UNSPLASH_BASE_URL = "https://api.unsplash.com";

export interface TrendingArticle {
  id: string;
  title: string;
  description: string;
  source: string;
  url: string;
  imageUrl: string;
  publishedAt: string;
  topic: string;
  recommendedTitle?: string; // Optional AI-generated recommended title
  category: string; // Added category property
}

// Demo data for when API keys are missing
const DEMO_DATA: TrendingArticle[] = [
  {
    id: "demo-1",
    title: "Breaking: Latest Technology Innovations Reshape Industry",
    description:
      "Explore the cutting-edge advancements transforming how we live and work in the digital age.",
    source: "Tech News Daily",
    url: "https://example.com/article-1",
    imageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
    publishedAt: new Date().toISOString(),
    topic: "Technology",
    category: "Technology",
  },
  {
    id: "demo-2",
    title: "Global Markets React to Economic Changes",
    description:
      "Financial experts analyze the impact of recent policy shifts on international markets.",
    source: "Financial Times",
    url: "https://example.com/article-2",
    imageUrl:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800",
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    topic: "Business",
    category: "Business",
  },
  {
    id: "demo-3",
    title: "Climate Summit Reaches Historic Agreement",
    description:
      "World leaders commit to ambitious new targets for reducing carbon emissions.",
    source: "World News Network",
    url: "https://example.com/article-3",
    imageUrl:
      "https://images.unsplash.com/photo-1569163139394-de4798aa62b3?w=800",
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    topic: "Environment",
    category: "Environment",
  },
  {
    id: "demo-4",
    title: "New Health Study Reveals Breakthrough Findings",
    description:
      "Researchers discover promising approaches to treating chronic conditions.",
    source: "Health Journal",
    url: "https://example.com/article-4",
    imageUrl:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
    publishedAt: new Date(Date.now() - 10800000).toISOString(),
    topic: "Health",
    category: "Health",
  },
  {
    id: "demo-5",
    title: "Space Exploration Achieves New Milestone",
    description:
      "Mission to Mars makes significant progress as team celebrates successful landing.",
    source: "Space News",
    url: "https://example.com/article-5",
    imageUrl:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800",
    publishedAt: new Date(Date.now() - 14400000).toISOString(),
    topic: "Science",
    category: "Science",
  },
];

// Fetch trending topics from Google Trends
const getTrendingTopics = async (): Promise<string[]> => {
  console.log("Google Trends API is not available. Using fallback topics.");
  return ["Technology", "Business", "Health", "Science", "Entertainment"];
};

// Fetch articles from GNews API
const fetchArticlesForTopic = async (topic: string): Promise<any[]> => {
  if (!GNEWS_API_KEY) {
    return [];
  }

  try {
    const response = await axios.get(`${GNEWS_BASE_URL}/search`, {
      params: {
        q: topic,
        lang: "en",
        max: 3,
        apikey: GNEWS_API_KEY,
      },
    });

    return response.data.articles || [];
  } catch (error) {
    console.error(`Error fetching articles for topic "${topic}":`, error);
    return [];
  }
};

// Fetch image from Unsplash
const fetchImageForQuery = async (query: string): Promise<string> => {
  if (!UNSPLASH_ACCESS_KEY) {
    // Return a placeholder image if no API key
    return `https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800`;
  }

  try {
    const response = await axios.get(`${UNSPLASH_BASE_URL}/search/photos`, {
      params: {
        query,
        per_page: 1,
        orientation: "landscape",
      },
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });

    if (response.data.results && response.data.results.length > 0) {
      return response.data.results[0].urls.regular;
    }

    return `https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800`;
  } catch (error) {
    console.error(`Error fetching image for query "${query}":`, error);
    return `https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800`;
  }
};

// Main function to fetch trending feed
export const fetchTrendingFeed = async (
  selectedCategories: string[] = []
): Promise<TrendingArticle[]> => {
  console.log("fetchTrendingFeed called with categories:", selectedCategories);
  // If API keys are missing, return demo data
  if (!GNEWS_API_KEY || !UNSPLASH_ACCESS_KEY) {
    console.log("API keys missing. Returning demo data.");
    return DEMO_DATA;
  }

  try {
    // Step 1: Determine topics based on selected categories
    let topicsToFetch: string[];
    if (selectedCategories.length > 0) {
      topicsToFetch = selectedCategories;
    } else {
      // Fallback to default topics if no categories are selected
      topicsToFetch = [
        "Technology",
        "Business",
        "Health",
        "Science",
        "Entertainment",
      ];
    }
    console.log("Topics to fetch:", topicsToFetch);

    // Step 2: Fetch articles for each topic/category
    const allArticles: TrendingArticle[] = [];

    for (const topic of topicsToFetch) {
      console.log("Fetching articles for topic:", topic);
      const articles = await fetchArticlesForTopic(topic);
      console.log(`Found ${articles.length} articles for topic "${topic}"`);

      for (const article of articles) {
        // Step 3: Fetch image for each article
        const imageUrl = await fetchImageForQuery(article.title);
        console.log(`Fetched image for article "${article.title}"`);

        allArticles.push({
          id: `${topic}-${article.title}-${Date.now()}`,
          title: article.title,
          description: article.description,
          source: article.source.name,
          url: article.url,
          imageUrl,
          publishedAt: article.publishedAt,
          topic,
          category: topic, // Assign the topic as the category
        });
      }

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    console.log("Total articles fetched:", allArticles.length);
    return allArticles;
  } catch (error) {
    console.error("Error building trending feed:", error);
    // Return demo data as fallback
    return DEMO_DATA;
  }
};

// Retry mechanism for failed requests
export const fetchTrendingFeedWithRetry = async (
  selectedCategories: string[] = [],
  maxRetries = 3
): Promise<TrendingArticle[]> => {
  let lastError: any;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const feed = await fetchTrendingFeed(selectedCategories);
      if (feed.length > 0) {
        return feed;
      }
    } catch (error) {
      lastError = error;
      console.log(`Retry ${i + 1}/${maxRetries} failed:`, error);

      // Wait before retrying (exponential backoff)
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }

  console.error("All retries failed. Returning demo data.");
  return DEMO_DATA;
};
