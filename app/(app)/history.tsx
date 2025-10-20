import { useAuth } from '@/contexts/AuthContext';
import { getUserArticles } from '@/lib/supabase';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface Article {
  id: string;
  title: string;
  content: string;
  word_count: number;
  created_at: string;
  keywords: string;
}

export default function HistoryScreen() {
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadArticles = async () => {
    if (!user) return;

    try {
      const { data, error } = await getUserArticles(user.id);
      if (data) {
        setArticles(data);
      }
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    loadArticles();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleArticlePress = (article: Article) => {
    router.push({
      pathname: '/(app)/article-result',
      params: {
        content: article.content,
        title: article.title,
        wordCount: article.word_count.toString(),
      },
    });
  };

  const renderArticleItem = ({ item }: { item: Article }) => (
    <TouchableOpacity
      style={styles.articleCard}
      onPress={() => handleArticlePress(item)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.articleTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.articleDate}>{formatDate(item.created_at)}</Text>
      </View>
      <Text style={styles.articlePreview} numberOfLines={3}>
        {item.content}
      </Text>
      <View style={styles.cardFooter}>
        <Text style={styles.wordCount}>{item.word_count} words</Text>
        {item.keywords && (
          <Text style={styles.keywords} numberOfLines={1}>
            {item.keywords}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Article History</Text>
        <Text style={styles.headerSubtitle}>
          {articles.length} {articles.length === 1 ? 'article' : 'articles'}
        </Text>
      </View>

      {articles.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📝</Text>
          <Text style={styles.emptyText}>No articles yet</Text>
          <Text style={styles.emptySubtext}>
            Start by creating your first article!
          </Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => router.push('/(app)/create-article')}
          >
            <Text style={styles.createButtonText}>Create Article</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={articles}
          renderItem={renderArticleItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#007AFF"
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    marginBottom: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  listContent: {
    padding: 20,
  },
  articleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    marginBottom: 10,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 5,
  },
  articleDate: {
    fontSize: 12,
    color: '#999999',
  },
  articlePreview: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  wordCount: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  keywords: {
    fontSize: 12,
    color: '#999999',
    flex: 1,
    marginLeft: 10,
    textAlign: 'right',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
  },
  createButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
