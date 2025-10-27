import LottieView from "lottie-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function GeneratingArticleScreen() {
  return (
    <View style={styles.container}>
      <LottieView
        source={{
          uri: "https://assets3.lottiefiles.com/packages/lf20_q7a0g9.json",
        }}
        autoPlay
        loop
        style={styles.animation}
      />
      <Text style={styles.text}>Generating your article...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  animation: {
    width: 250,
    height: 250,
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
  },
});
