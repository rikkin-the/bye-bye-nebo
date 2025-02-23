import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import * as SQLite from 'expo-sqlite';

// データベースを開く
const db = SQLite.openDatabase('hayaoki.db');

const Example = () => {
  const [alarmData, setAlarmData] = useState([]);

  useEffect(() => {
    // データベースからalarm_dataのデータを取得
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM alarm_data',
        [],
        (_, { rows: { _array } }) => {
          setAlarmData(_array); // 取得したデータをstateに保存
        },
        (_, error) => {
          console.log('データ取得エラー:', error);
          return true;
        }
      );
    });
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text>起床予定時刻: {item.wake_up_time}</Text>
      <Text>実際の起床時刻: {item.actual_wake_up_time}</Text>
      <Text>活動開始時刻: {item.activity_start_time}</Text>
      <Text>時間差: {item.time_difference}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>アラームデータ一覧</Text>
      <FlatList
        data={alarmData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default Example;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  itemContainer: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
});
