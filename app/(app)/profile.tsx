import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import React from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ProfileScreen() {
  const { user, userProfile, signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/');
          },
        },
      ]
    );
  };

  const handleUpgradeToPremium = () => {
    Alert.alert(
      'Upgrade to Premium',
      'Premium features:\n\n• Unlimited word count\n• Image uploads with alt text\n• Priority support\n• Early access to new features\n\nContact us to upgrade!',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile & Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user?.email?.charAt(0).toUpperCase() || '?'}
            </Text>
          </View>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {userProfile?.is_premium ? '⭐ Premium Member' : '🆓 Free Tier'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Statistics</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {userProfile?.article_count || 0}
              </Text>
              <Text style={styles.statLabel}>Articles Created</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {userProfile?.is_premium ? '∞' : '500'}
              </Text>
              <Text style={styles.statLabel}>Max Words</Text>
            </View>
          </View>
        </View>

        {!userProfile?.is_premium && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.premiumCard}
              onPress={handleUpgradeToPremium}
            >
              <View style={styles.premiumHeader}>
                <Text style={styles.premiumIcon}>⭐</Text>
                <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
              </View>
              <Text style={styles.premiumDescription}>
                Unlock unlimited words, image uploads, and more!
              </Text>
              <View style={styles.premiumButton}>
                <Text style={styles.premiumButtonText}>Learn More →</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => router.push('/(app)/history')}
          >
            <Text style={styles.settingIcon}>📚</Text>
            <Text style={styles.settingText}>Article History</Text>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => Alert.alert('Help', 'Contact support@seoarticlegenerator.com for assistance')}
          >
            <Text style={styles.settingIcon}>❓</Text>
            <Text style={styles.settingText}>Help & Support</Text>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => Alert.alert('About', 'SEO Article Generator v1.0\nPowered by Anthropic Claude AI')}
          >
            <Text style={styles.settingIcon}>ℹ️</Text>
            <Text style={styles.settingText}>About</Text>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  content: {
    padding: 20,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  email: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 10,
  },
  statusBadge: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  statsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },
  premiumCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  premiumIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  premiumDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 15,
    lineHeight: 20,
  },
  premiumButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  premiumButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  settingItem: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  settingArrow: {
    fontSize: 18,
    color: '#999999',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999999',
    marginTop: 10,
  },
});
