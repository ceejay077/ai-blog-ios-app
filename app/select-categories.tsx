import { MAIN_CATEGORIES } from "@/constants/categories";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Button, Chip } from "react-native-paper";

const CATEGORIES_STORAGE_KEY = "user_selected_categories";

export default function SelectCategoriesScreen() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

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
        console.error("Failed to load selected categories:", error);
      } finally {
        setLoading(false);
      }
    };
    loadSelectedCategories();
  }, []);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(category)
        ? prevSelected.filter((c) => c !== category)
        : [...prevSelected, category]
    );
  };

  const handleContinue = async () => {
    try {
      await AsyncStorage.setItem(
        CATEGORIES_STORAGE_KEY,
        JSON.stringify(selectedCategories)
      );
      router.replace("/(app)/create-article"); // Navigate to the create article page
    } catch (error) {
      console.error("Failed to save selected categories:", error);
      // Optionally, show an error message to the user
    }
  };

  if (loading) {
    return (
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Loading preferences...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Choose Your Interests</Text>
        <Text style={styles.subtitle}>
          Select categories to personalize your trending feed.
        </Text>

        <View style={styles.chipsContainer}>
          {MAIN_CATEGORIES.map((category) => (
            <Chip
              key={category}
              mode="outlined"
              selected={selectedCategories.includes(category)}
              onPress={() => toggleCategory(category)}
              style={[
                styles.chip,
                selectedCategories.includes(category) && styles.selectedChip,
              ]}
              textStyle={[
                styles.chipText,
                selectedCategories.includes(category) &&
                  styles.selectedChipText,
              ]}
            >
              {category}
            </Chip>
          ))}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleContinue}
          disabled={selectedCategories.length === 0}
          style={styles.continueButton}
          labelStyle={styles.continueButtonText}
        >
          Continue
        </Button>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, // Space for the fixed button
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginBottom: 30,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  chip: {
    margin: 6,
    borderColor: "rgba(255,255,255,0.5)",
    backgroundColor: "transparent",
  },
  selectedChip: {
    backgroundColor: "#ffffff",
    borderColor: "#ffffff",
  },
  chipText: {
    color: "#ffffff",
    fontWeight: "500",
  },
  selectedChipText: {
    color: "#667eea",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "transparent", // Ensure it blends with the gradient
  },
  continueButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 8,
    borderRadius: 10,
  },
  continueButtonText: {
    color: "#667eea",
    fontWeight: "bold",
    fontSize: 18,
  },
});
