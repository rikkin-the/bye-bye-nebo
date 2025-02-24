import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function AlarmSettingScreen({ navigation, route }) {
  const [alarmTime, setAlarmTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const currentDate = new Date();

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || alarmTime;
    setShowDatePicker(false);
    setAlarmTime(currentDate); // 日付の選択を更新
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || alarmTime;
    setShowTimePicker(false);
    setAlarmTime(currentTime); // 時間の選択を更新
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
        <Text style={styles.alarmText}>選択した日時：</Text>
        <Text style={styles.alarmTime}>{alarmTime.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}</Text>
      </View>

      {/* 日付の選択ボタン */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => setShowDatePicker(true)} // 日付を選択するためのボタン
      >
        <Text style={styles.buttonText}>日付を選択</Text>
      </TouchableOpacity>

      {/* 時間の選択ボタン */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => setShowTimePicker(true)} // 時間を選択するためのボタン
      >
        <Text style={styles.buttonText}>時間を選択</Text>
      </TouchableOpacity>

      {/* 日付ピッカー */}
      {showDatePicker && (
        <DateTimePicker
          value={alarmTime}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={currentDate}
        />
      )}

      {/* 時間ピッカー */}
      {showTimePicker && (
        <DateTimePicker
          value={alarmTime}
          mode="time"
          display="default"
          onChange={handleTimeChange}
          minimumDate={currentDate}
        />
      )}

      {/* 就寝ボタン */}
      <TouchableOpacity style={styles.button} onPress={handleSleepPress}>
        <Text style={styles.buttonText}>就寝</Text>
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
  button: {
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
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  editButton: {
    backgroundColor: "#6495ED",
    width: 150,
    height: 50,
    borderRadius: 60, // 円形にする
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});