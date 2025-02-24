import React, {useEffect, useState} from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as SQLite from 'expo-sqlite';
import { Audio } from 'expo-av';

export default function AlarmPage2({navigation, route}) {
  const alarmTime = new Date(route.params.alarmTime);
  const wakeUpTime = new Date(route.params.wakeUpTime);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date()); 

  const playSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/bell2.mp3') // 音楽ファイルのパスを指定
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
      }, 3000);
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

  const handleStart = () => {
    const startTime = new Date();

    async function insertData() {
      try {
        const db = await SQLite.openDatabaseAsync('hayaoki.db', { useNewConnection: true });

        const timeDifferenceMillis = startTime.getTime() - wakeUpTime.getTime();
        const timeDifferenceMinutes = Math.floor(timeDifferenceMillis / 1000 / 60);

        const alarmTimeString = alarmTime.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
        const wakeUpTimeString = wakeUpTime.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
        const startTimeString = startTime.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });

        await db.execAsync(`
          PRAGMA journal_mode = WAL;
          INSERT INTO alarm_data (wake_up_time, actual_wake_up_time, activity_start_time, time_difference) 
          VALUES 
          ("${alarmTimeString}", "${wakeUpTimeString}", "${startTimeString}", "${timeDifferenceMinutes}");
        `);

        const rows = await db.getAllAsync('SELECT * FROM alarm_data');

        if (db) {
          await db.closeAsync();
        }
        console.log('🌟rows', rows);
      } catch (error) {
        console.log('エラーですよ（アラームページ２）:', error);
      }
    }
    insertData();

    Alert.alert(
      "確認",
      "活動開始しますか？",
      [
        { text: "キャンセル", style: "cancel" },
        { text: "OK", onPress: () => {
          setIsPlaying(true);
          navigation.navigate("MorningRoutine");
        }
        },
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
      <TouchableOpacity style={styles.wakeUpButton}>
        <Text style={styles.wakeUpButtonText}>起床</Text>
      </TouchableOpacity>

      {/* 活動開始ボタン */}
      <TouchableOpacity style={styles.startButton} onPress={handleStart}>
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
  startButton: {
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