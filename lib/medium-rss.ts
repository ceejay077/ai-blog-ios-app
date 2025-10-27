import * as rssParser from "react-native-rss-parser";

const MEDIUM_RSS_URL = "https://medium.com/feed/trending";

interface MediumArticle {
  title: string;
  link: string;
  author: string;
  imageUrl: string | undefined;
}

export const getTrendingArticles = async (): Promise<MediumArticle[]> => {
  try {
    const response = await fetch(MEDIUM_RSS_URL);
    const responseData = await response.text();
    const feed = await rssParser.parse(responseData);

    return feed.items.map((item) => {
      // Extract image from description
      const content = item.description || "";
      const match = content.match(/<img[^>]+src="([^">]+)"/);
      const imageUrl = match ? match[1] : undefined;

      return {
        title: item.title || "No Title",
        link: item.links[0]?.url || "",
        author: item.authors[0]?.name || "No Author",
        imageUrl,
      };
    });
  } catch (error) {
    console.error("Failed to fetch trending articles from Medium:", error);
    return [];
  }
};
