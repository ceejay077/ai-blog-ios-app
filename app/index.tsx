import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function WelcomeScreen() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      // If user is logged in, navigate to main page (tabs)
      setTimeout(() => router.replace("/(tabs)"), 0);
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoIcon}>📝</Text>
          <Text style={styles.logoText}>SEO Article</Text>
          <Text style={styles.logoTextSecondary}>Generator</Text>
        </View>

        <Text style={styles.tagline}>
          Create Professional, SEO-Optimized Blog Articles with AI
        </Text>

        <View style={styles.features}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✨</Text>
            <Text style={styles.featureText}>AI-Powered Content</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🎯</Text>
            <Text style={styles.featureText}>SEO Optimized</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>⚡</Text>
            <Text style={styles.featureText}>Generate in Seconds</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.startButton}
          onPress={() => router.push("/(auth)/login")}
        >
          <Text style={styles.startButtonText}>Get Started</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>Powered by Anthropic Claude AI</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoIcon: {
    fontSize: 80,
    marginBottom: 15,
  },
  logoText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#000000",
    letterSpacing: 1,
  },
  logoTextSecondary: {
    fontSize: 28,
    fontWeight: "600",
    color: "#007AFF",
    marginTop: -5,
  },
  tagline: {
    fontSize: 18,
    color: "#666666",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 26,
    maxWidth: 320,
  },
  features: {
    width: "100%",
    marginBottom: 50,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  featureText: {
    fontSize: 16,
    color: "#333333",
    fontWeight: "500",
  },
  startButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  footerText: {
    position: "absolute",
    bottom: 30,
    fontSize: 12,
    color: "#999999",
  },
});
