import { generateRecommendedTitleGemini } from "@/lib/gemini";
import {
  fetchTrendingFeedWithRetry,
  TrendingArticle,
} from "@/lib/trending-feed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Linking,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Card, Chip } from "react-native-paper";

const { width } = Dimensions.get("window");

const CATEGORIES_STORAGE_KEY = "user_selected_categories";

export default function HomeScreen() {
  const [articles, setArticles] = useState<TrendingArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const loadFeed = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      let feed = await fetchTrendingFeedWithRetry(selectedCategories);

      // Generate recommended titles for each article
      const articlesWithRecommendedTitles = await Promise.all(
        feed.map(async (article) => {
          const recommendedTitle = await generateRecommendedTitleGemini(
            article.title,
            article.category
          );
          return { ...article, recommendedTitle };
        })
      );

      setArticles(articlesWithRecommendedTitles);
    } catch (err) {
      setError("Failed to load trending feed. Pull down to retry.");
      console.error("Error loading feed:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const loadSelectedCategories = async () => {
      try {
        const storedCategories = await AsyncStorage.getItem(
          CATEGORIES_STORAGE_KEY
        );
        if (storedCategories) {
          setSelectedCategories(JSON.parse(storedCategories));
        }
      } catch (error) {
        console.error(
          "Failed to load selected categories from storage:",
          error
        );
      }
    };

    loadSelectedCategories();
  }, []);

  useEffect(() => {
    if (selectedCategories.length > 0 || !loading) {
      // Only load feed once categories are loaded or if it's not the initial load
      loadFeed();
    }
  }, [selectedCategories]); // Reload feed when selectedCategories change

  const onRefresh = useCallback(() => {
    loadFeed(true);
  }, [selectedCategories]);

  const handleArticlePress = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open link:", err)
    );
  };

  const renderArticle = ({
    item,
    index,
  }: {
    item: TrendingArticle;
    index: number;
  }) => (
    <Card style={styles.card} elevation={3}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handleArticlePress(item.url)}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={styles.imageGradient}
          />
          <View style={styles.topicChipContainer}>
            <Chip style={styles.topicChip} textStyle={styles.topicChipText}>
              {item.topic}
            </Chip>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.title} numberOfLines={3}>
            {item.recommendedTitle || item.title}
          </Text>

          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.metaContainer}>
            <Text style={styles.source}>{item.source}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.time}>{formatTime(item.publishedAt)}</Text>
          </View>

          <Button
            mode="contained"
            onPress={() => handleArticlePress(item.url)}
            style={styles.readMoreButton}
            labelStyle={styles.readMoreButtonText}
          >
            Read More
          </Button>
        </View>
      </TouchableOpacity>
    </Card>
  );

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Loading trending stories...</Text>
      </LinearGradient>
    );
  }

  if (error && articles.length === 0) {
    return (
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={styles.errorContainer}
      >
        <Text style={styles.errorText}>{error}</Text>
        <Button
          mode="contained"
          onPress={() => loadFeed()}
          style={styles.retryButton}
          labelStyle={styles.retryButtonText}
        >
          Retry
        </Button>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        <Text style={styles.headerSubtitle}>Trending stories just for you</Text>
      </LinearGradient>

      <FlatList
        data={articles}
        renderItem={renderArticle}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#667eea"
            colors={["#667eea", "#764ba2"]}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#ffffff",
    fontSize: 16,
    marginTop: 16,
    fontWeight: "500",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "500",
  },
  retryButton: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
  },
  retryButtonText: {
    color: "#667eea",
    fontWeight: "bold",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
  },
  listContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#ffffff",
  },
  imageContainer: {
    position: "relative",
    height: 220,
    width: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
  },
  topicChipContainer: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  topicChip: {
    backgroundColor: "rgba(102, 126, 234, 0.95)",
  },
  topicChipText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a202c",
    marginBottom: 8,
    lineHeight: 28,
  },
  description: {
    fontSize: 14,
    color: "#4a5568",
    marginBottom: 12,
    lineHeight: 20,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  source: {
    fontSize: 13,
    color: "#667eea",
    fontWeight: "600",
  },
  dot: {
    fontSize: 13,
    color: "#a0aec0",
    marginHorizontal: 6,
  },
  time: {
    fontSize: 13,
    color: "#a0aec0",
  },
  readMoreButton: {
    backgroundColor: "#667eea",
    borderRadius: 8,
  },
  readMoreButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
});
