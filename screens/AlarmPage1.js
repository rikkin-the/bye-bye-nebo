import React, {useEffect, useState} from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Audio } from 'expo-av';

export default function AlarmPage1({ navigation, route }) {
  const alarmTime = new Date(route.params.alarmTime);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date()); 

  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/bell.mp3') // 音楽ファイルのパスを指定
      );
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error('音楽の再生エラー:', error);
    }
  };

  // 毎秒CurrentTimeを設定
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date()); // 1秒ごとに現在時刻を更新
    }, 5000);
    return () => clearInterval(interval); // クリーンアップ
  }, []);

  useEffect(() => {
    const checkTime = () => {
      if (currentTime >= alarmTime && !isPlaying) {
        playSound();
      }
    };
    checkTime();
  }, [currentTime]);

  const handleWakeUpPress = () => {
    const wakeUpTime = new Date();
    Alert.alert(
      "確認",
      "起床しますか？",
      [
        { text: "キャンセル", style: "cancel" },
        { text: "OK", onPress: () => {
          setIsPlaying(true);
          navigation.navigate("AlarmPage2", { alarmTime: alarmTime.toISOString(), wakeUpTime: wakeUpTime.toISOString() });
        },
        }
      ]
    )
  };

  return (
    <View style={styles.container}>
      
      {/* 起床予定時刻のボックス */}
      <View style={styles.alarmBox}>
        <Text style={styles.alarmText}>起床予定時刻</Text>
        <Text style={styles.alarmTime}>{alarmTime.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}</Text>
      </View>

      {/* 起床ボタン */}
      <TouchableOpacity style={styles.wakeUpButton} onPress={handleWakeUpPress}>
        <Text style={styles.wakeUpButtonText}>起床</Text>
      </TouchableOpacity>

      {/* 活動開始ボタン */}
      <TouchableOpacity style={styles.startButton}>
        <Text style={styles.startButtonText}>活動開始</Text>
      </TouchableOpacity>
    </View>
  );
}

// スタイル設定
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFD1DC",
    justifyContent: "center",
    alignItems: "center",
  },
  alarmBox: {
    backgroundColor: "#D3D3D3",
    padding: 30,
    borderRadius: 15,
    alignItems: "center",
    width: 250,
    marginTop: -80, // 画面の上の方に移動
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  alarmText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  alarmTime: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 5,
  },
  wakeUpButton: {
    backgroundColor: "#FF0000",
    width: 150,
    height: 150,
    borderRadius: 60, // 円形にする
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  startButton: {
    backgroundColor: "#D3D3D3",
    width: 150,
    height: 150,
    borderRadius: 60, // 円形にする
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  wakeUpButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  startButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});