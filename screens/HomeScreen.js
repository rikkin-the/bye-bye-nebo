import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function HomeScreen({ navigation }) {
  const [currentTime, setCurrentTime] = useState(""); //currentTimeが変数で、setCurrentTimeが変数を更新する関数（紐づいている）

  // 日付 & 時刻を取得する関数
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = now.toLocaleString(); // 例: "2025/02/18 14:30:00"
      setCurrentTime(formattedTime); 
    };

    updateTime(); // 初回実行
    const interval = setInterval(updateTime, 1000); // 1秒ごとに更新

    return () => clearInterval(interval); // クリーンアップ
  }, []);

  return (
    <View style={styles.container}>
      {/* 上半分 - アプリ名 & 日時 */}
      <View style={styles.topSection}>
        <Text style={styles.appTitle}>Bye Bye 寝坊</Text>
        <Text style={styles.dateTime}>{currentTime}</Text>
      </View>

      {/* 下半分 - ボタン */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("AlarmSetting")}
        >
          <Text style={styles.buttonText}>起床時間登録</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} /> {/* ボタン間のスペース */}

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("MyPage")}
        >
          <Text style={styles.buttonText}>マイページ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// スタイル設定
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFD1DC",
    justifyContent: "space-between", // 上半分と下半分に分ける
    paddingVertical: 60,
  },
  topSection: {
    alignItems: "center",
  },
  appTitle: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 30,
  },
  dateTime: {
    fontSize: 30,
    color: "gray",
  },
  bottomSection: {
    alignItems: "center",
  },
  button: {
    backgroundColor: "#FF6347", // 緑色のボタン
    paddingVertical: 55, // ボタンの高さを増やす
    paddingHorizontal: 40, // 横幅を広げる
    borderRadius: 10,
    width: 250, // ボタンの幅を大きく
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 25, // ボタンの文字サイズを大きく
    fontWeight: "bold",
  },
});

