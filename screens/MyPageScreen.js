<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import * as SQLite from 'expo-sqlite';

// 画面幅を取得
const screenWidth = Dimensions.get('window').width;

// 0埋めして2桁にする関数
function pad(num) {
  return num < 10 ? '0' + num : num;
}

// 寝坊度のコメント基準
function getSleepComment(avg) {
  if (avg <= 10) return '素晴らしい';
  if (avg > 10 && avg < 20) return 'いいね！！';
  return '頑張ろう・・・';
}

// 達成度のコメント基準
function getAchievementComment(avg) {
  if (avg >= 80) return '素晴らしい達成率！';
  if (avg >= 50) return 'いい調子！';
  return 'もっと頑張ろう！';
}

export default function MyPageScreen() {
  const [alarmData, setAlarmData] = useState([]);     // 寝坊度用データ（alarm_data）
  const [progressData, setProgressData] = useState([]); // 達成度用データ（progress）
  const [isSleepData, setIsSleepData] = useState(true); // true: 寝坊度, false: 達成度

  useEffect(() => {
    async function readData() {
      try {
        // データベースをオープン
        const db = await SQLite.openDatabaseAsync('hayaoki.db');
        
        // alarm_data テーブルのデータを取得
        const alarmRows = await db.getAllAsync('SELECT * FROM alarm_data');
        console.log('アラーム用テーブルのデータ：', alarmRows);
        setAlarmData(alarmRows);

        // progress テーブルのデータを取得
        const progressRows = await db.getAllAsync('SELECT * FROM progress');
        console.log('進捗用テーブルのデータ：', progressRows);
        setProgressData(progressRows);
      } catch (error) {
        console.log('Error:', error);
      }
    }
    readData();
  }, []);

  // 今日を含む「過去7日間」の日付配列を生成（左が過去、右が今日）
  const daysArray = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const matchDate = `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())}`;
    const label = `${pad(date.getMonth() + 1)}/${pad(date.getDate())}`; // グラフ用ラベル (MM/DD)
    daysArray.push({ matchDate, label });
  }

  // 寝坊度/達成度 グラフ切り替え用の値を取得
  let chartLabel = '寝坊度';
  let yAxisSuffix = '分';
  let dataArray = alarmData;
  let getValue = (record) => parseInt(record.time_difference, 10);
  let matchKey = 'wake_up_time';
  let getComment = getSleepComment;

  if (!isSleepData) {
    chartLabel = '達成度';
    yAxisSuffix = '%';
    dataArray = progressData;
    getValue = (record) => parseInt(record.achievement, 10);
    matchKey = 'date';
    getComment = getAchievementComment;
  }

  // 日付ごとの値を取得し、なければ 0 を入れる
  const chartValues = daysArray.map((day) => {
    // alarm_data → wake_up_time.substring(0, 10) === day.matchDate
    // progress_data → date === day.matchDate
    const record = dataArray.find((r) =>
      isSleepData
        ? r.wake_up_time.substring(0, 10) === day.matchDate
        : r.date === day.matchDate
    );
    return record ? getValue(record) : 0;
  });

  // グラフデータ
  const chartData = {
    labels: daysArray.map((day) => day.label),
    datasets: [
      {
        data: chartValues,
      },
    ],
  };

  // 平均の計算
  const sum = chartValues.reduce((acc, curr) => acc + curr, 0);
  const average = chartValues.length > 0 ? Math.round(sum / chartValues.length) : 0;
  // コメント取得
  const comment = getComment(average);

  // グラフの目盛り調整
  const maxValue = Math.max(...chartValues, 0);
  let yAxisInterval = 10;
  let yAxisMax = Math.ceil(maxValue / yAxisInterval) * yAxisInterval;
  let segments = yAxisMax / yAxisInterval;
  if (segments > 6) {
    yAxisInterval = 20;
    yAxisMax = Math.ceil(maxValue / yAxisInterval) * yAxisInterval;
    segments = yAxisMax / yAxisInterval;
  }

  // グラフ切り替えボタン
  const toggleChart = () => {
    setIsSleepData(!isSleepData);
  };

  return (
    <ScrollView style={styles.container}>
      {/* タイトル */}
      <Text style={styles.header}>{chartLabel}</Text>

      {/* グラフ切り替えボタン */}
      <TouchableOpacity style={styles.toggleButton} onPress={toggleChart}>
        <Text style={styles.toggleButtonText}>
          {isSleepData ? '達成度に切り替え' : '寝坊度に切り替え'}
        </Text>
      </TouchableOpacity>

      {/* グラフ表示枠 */}
      <View style={styles.chartContainer}>
        <Text style={styles.periodText}>
          {daysArray[0].label}~{daysArray[6].label}
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <BarChart
            data={chartData}
            width={screenWidth - 40}
            height={200}
            yAxisSuffix={yAxisSuffix}
            yAxisInterval={yAxisInterval}
            fromZero
            segments={segments}
            chartConfig={{
              backgroundColor: '#fff0f0',
              backgroundGradientFrom: '#fff0f0',
              backgroundGradientTo: '#fff0f0',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: { borderRadius: 16, paddingRight: 10 },
              barPercentage: 0.6,
            }}
            style={{ borderRadius: 16 }}
          />
        </ScrollView>
      </View>

      {/* 今週の平均 */}
      <View style={styles.averageContainer}>
        <Text style={styles.averageLabel}>今週の平均</Text>
        <Text style={styles.averageValue}>
          {average}
          {isSleepData ? '分' : '%'}
        </Text>
      </View>

      {/* 吹き出しコメント */}
      <View style={styles.speechBubbleContainer}>
        <View style={styles.speechBubbleTail} />
        <View style={styles.speechBubble}>
          <Text style={styles.speechText}>{comment}</Text>
        </View>
      </View>
    </ScrollView>
  );
=======
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
>>>>>>> feature_alarmpages_tasaki
}

// スタイル設定
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  toggleButton: {
    backgroundColor: '#ff9999',
    padding: 10,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chartContainer: {
    backgroundColor: '#ffe6e6',
    borderRadius: 16,
    padding: 10,
    marginHorizontal: 20,
    overflow: 'hidden',
    alignItems: 'center',
  },
  periodText: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 20,
  },
  averageContainer: {
    backgroundColor: '#ffe6e6',
    borderRadius: 16,
    padding: 30,
    margin: 20,
    alignItems: 'center',
    position: 'relative',
  },
  averageLabel: {
    fontSize: 18,
    marginBottom: 10,
  },
  averageValue: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  speechBubbleContainer: {
    alignItems: 'center',
    marginTop: -30,
    position: 'relative',
  },
  speechBubble: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 20,
    borderColor: '#ff9999',
    borderWidth: 2,
    position: 'relative',
    minWidth: 100,
  },
  speechBubbleTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#fff',
    position: 'absolute',
    top: -10,
  },
  speechText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#ff3333',
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
