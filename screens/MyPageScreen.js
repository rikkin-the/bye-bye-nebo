import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function MyPageScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>マイページ</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
