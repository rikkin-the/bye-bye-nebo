import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function AlarmSettingScreen({navigation}) {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);
  currentDate.setHours(6, 0, 0, 0);
  const [alarmTime, setAlarmTime] = useState(currentDate);
  const [showPicker, setShowPicker] = useState(false);

  // 時刻選択時の処理
  const onChange = (event, selectedDate) => {
    if (selectedDate) {
      setAlarmTime(selectedDate);
    }
    setShowPicker(false); // ピッカーを閉じる
  };

  //就寝ボタンを押したときの処理
  const handleSleepPress = () => {
    Alert.alert(
      "確認",
      "就寝しますか？",
      [
        { text: "キャンセル", style: "cancel" },
        { text: "OK", onPress: () => navigation.navigate("AlarmPage1", { alarmTime: alarmTime.toISOString() }) },
      ]
    )
  };

  return (
    <View style={styles.container}>
      {/* 起床予定時刻のボックス */}
      <View style={styles.alarmBox}>
        <Text style={styles.alarmText}>起床予定時刻</Text>
        <Text style={styles.alarmTime}>{alarmTime.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}</Text>
        <TouchableOpacity style={styles.editButton} onPress={() => setShowPicker(true)}>
          <Text style={styles.editButtonText}>修正</Text>
        </TouchableOpacity>
      </View>

      {/* 時刻選択ピッカー */}
      {showPicker && (
        <DateTimePicker
          value={alarmTime}
          mode="time"
          is24Hour={true}
          display="spinner"
          onChange={onChange}
        />
      )}

      {/* 就寝ボタン */}
      <TouchableOpacity style={styles.sleepButton} onPress={handleSleepPress}>
        <Text style={styles.sleepButtonText}>就寝</Text>
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
  editButton: {
    backgroundColor: "#A9A9A9",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  editButtonText: {
    color: "#000",
    fontSize: 14,
  },
  sleepButton: {
    backgroundColor: "#6495ED",
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
  sleepButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});


