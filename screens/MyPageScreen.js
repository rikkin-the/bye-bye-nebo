import React, {useState, useEffect} from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import * as SQLite from 'expo-sqlite';

export default function MyPageScreen({navigation}) {
  const [data, setData] = useState([]);
    useEffect(() => {
      async function insertData() {
        try {
          const db = await SQLite.openDatabaseAsync('hayaoki.db', { useNewConnection: true });
          const rows = await db.getAllAsync('SELECT * FROM alarm_data');
          setData(rows);
          if (db) {
            await db.closeAsync();
          }
          console.log("🌟列情報です。", rows);
        } catch (error) {
          console.log('エラーですよ（MyPage）:', error);
        }
      }
      insertData();
    }, []);
  
    return (
      <View>
        <Text>MyPageScreen</Text>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <>
              <Text>{item.id}</Text>
              <Text>起床予定時刻：{item.wake_up_time.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}</Text>
              <Text>実際の起床時刻：{item.actual_wake_up_time.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}</Text>
              <Text>活動開始時刻：{item.activity_start_time.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}</Text>
              <Text>起床から活動開始までの差：{item.time_difference}</Text>
            </>
          )}
          keyExtractor={(item) => String(item.id)}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.buttonText}>ホームに戻る</Text>
        </TouchableOpacity>
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
  button: {
    backgroundColor: "green", // 緑色のボタン
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
