import { useAuth } from '@/contexts/AuthContext';
import { generateArticle } from '@/lib/anthropic';
import { createArticle, uploadArticleImage } from '@/lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function CreateArticleScreen() {
  const { user, userProfile } = useAuth();
  const [title, setTitle] = useState('');
  const [keywords, setKeywords] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [tone, setTone] = useState('Professional');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageAltText, setImageAltText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const isPremium = userProfile?.is_premium || false;
  const maxWords = isPremium ? 2000 : 500;

  const pickImage = async () => {
    if (!isPremium) {
      Alert.alert(
        'Premium Feature',
        'Image uploads are only available for Premium members. Upgrade to Premium to unlock this feature.',
        [{ text: 'OK' }]
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handlePaymentConfirm = () => {
    setShowPaymentModal(false);
    handleGenerateArticle();
  };

  const handleGenerate = () => {
    if (!title || !keywords || !targetAudience) {
      Alert.alert('Missing Information', 'Please fill in Title, Keywords, and Target Audience');
      return;
    }

    setShowPaymentModal(true);
  };

  const handleGenerateArticle = async () => {
    setLoading(true);

    try {
      let imageUrl = null;
      
      if (imageUri && isPremium && user) {
        const fileName = `article-${Date.now()}.jpg`;
        const { data, error } = await uploadArticleImage(user.id, imageUri, fileName);
        
        if (data) {
          imageUrl = data.publicUrl;
        }
      }

      const result = await generateArticle({
        title,
        keywords,
        targetAudience,
        tone,
        maxWords,
      });

      if (result.error) {
        Alert.alert('Generation Failed', result.error);
        setLoading(false);
        return;
      }

      if (!isPremium && result.wordCount > 500) {
        Alert.alert(
          'Word Limit Exceeded',
          `Your article is ${result.wordCount} words. Free users are limited to 500 words. Upgrade to Premium for unlimited words.`
        );
      }

      if (user) {
        await createArticle({
          user_id: user.id,
          title,
          keywords,
          target_audience: targetAudience,
          tone,
          content: result.content,
          word_count: result.wordCount,
          has_image: !!imageUrl,
          image_url: imageUrl || undefined,
          image_alt_text: imageAltText || undefined,
          payment_status: 'completed',
        });
      }

      setLoading(false);
      
      router.push({
        pathname: '/(app)/article-result',
        params: {
          content: result.content,
          title,
          wordCount: result.wordCount.toString(),
        },
      });
    } catch (error: any) {
      setLoading(false);
      Alert.alert('Error', error.message || 'Failed to generate article');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Create Article</Text>
          <Text style={styles.headerSubtitle}>
            {isPremium ? 'Premium Member' : `Free Tier - ${maxWords} words max`}
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Article Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your article title"
              placeholderTextColor="#999"
              value={title}
              onChangeText={setTitle}
              multiline
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Target Keywords *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., SEO, content marketing, blog writing"
              placeholderTextColor="#999"
              value={keywords}
              onChangeText={setKeywords}
              multiline
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Target Audience *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Digital marketers, small business owners"
              placeholderTextColor="#999"
              value={targetAudience}
              onChangeText={setTargetAudience}
              multiline
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tone (Optional)</Text>
            <View style={styles.toneButtons}>
              {['Professional', 'Casual', 'Friendly', 'Authoritative'].map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.toneButton,
                    tone === t && styles.toneButtonActive,
                  ]}
                  onPress={() => setTone(t)}
                >
                  <Text
                    style={[
                      styles.toneButtonText,
                      tone === t && styles.toneButtonTextActive,
                    ]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Article Image (Optional)</Text>
              {!isPremium && (
                <View style={styles.premiumBadge}>
                  <Text style={styles.premiumBadgeText}>PREMIUM</Text>
                </View>
              )}
            </View>
            <TouchableOpacity
              style={[
                styles.imageButton,
                !isPremium && styles.imageButtonDisabled,
              ]}
              onPress={pickImage}
            >
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              ) : (
                <Text style={styles.imageButtonText}>
                  {isPremium ? '📷 Choose Image' : '🔒 Premium Feature'}
                </Text>
              )}
            </TouchableOpacity>
            {imageUri && isPremium && (
              <TextInput
                style={[styles.input, styles.altTextInput]}
                placeholder="Image alt text for SEO"
                placeholderTextColor="#999"
                value={imageAltText}
                onChangeText={setImageAltText}
              />
            )}
          </View>

          <TouchableOpacity
            style={[styles.generateButton, loading && styles.generateButtonDisabled]}
            onPress={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.generateButtonText}>Generate Article</Text>
                <Text style={styles.generateButtonPrice}>$4.99</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.navigation}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => router.push('/(app)/history')}
            >
              <Text style={styles.navButtonText}>📚 History</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => router.push('/(app)/profile')}
            >
              <Text style={styles.navButtonText}>⚙️ Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showPaymentModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Purchase</Text>
            <Text style={styles.modalText}>
              Generate this article for $4.99?
            </Text>
            <Text style={styles.modalDetails}>
              • SEO-optimized content{'\n'}
              • Up to {maxWords} words{'\n'}
              • Instant generation
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => setShowPaymentModal(false)}
              >
                <Text style={styles.modalButtonCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonConfirm}
                onPress={handlePaymentConfirm}
              >
                <Text style={styles.modalButtonConfirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  premiumBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginLeft: 8,
  },
  premiumBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000000',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minHeight: 50,
  },
  altTextInput: {
    marginTop: 10,
  },
  toneButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  toneButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  toneButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  toneButtonText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  toneButtonTextActive: {
    color: '#FFFFFF',
  },
  imageButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    minHeight: 150,
  },
  imageButtonDisabled: {
    opacity: 0.6,
  },
  imageButtonText: {
    fontSize: 16,
    color: '#666666',
  },
  imagePreview: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  generateButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 10,
  },
  generateButtonPrice: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  navButtonText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 30,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalDetails: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 30,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalButtonCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  modalButtonCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  modalButtonConfirm: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  modalButtonConfirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
