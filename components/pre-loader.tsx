import LottieView from "lottie-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function PreLoader() {
  return (
    <View style={styles.container}>
      <LottieView
        source={{
          uri: "https://assets10.lottiefiles.com/packages/lf20_e5g2x6cr.json",
        }}
        autoPlay
        loop
        style={styles.animation}
      />
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
    width: 200,
    height: 200,
  },
});
