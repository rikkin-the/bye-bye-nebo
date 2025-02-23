import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import * as SQLite from 'expo-sqlite';

const screenWidth = Dimensions.get('window').width;

const testData = [
  { day: '日', nebou: 34, achievement: 60 },
  { day: '月', nebou: 0, achievement: 45 },
  { day: '火', nebou: 26, achievement: 90 },
  { day: '水', nebou: 0, achievement: 60 },
  { day: '木', nebou: 17, achievement: 30 },
  { day: '金', nebou: 0, achievement: 100 },
  { day: '土', nebou: 0, achievement: 70 },
];

const MyPageScreen = () => {
  const [data, setData] = useState(testData);
  const [isSleepData, setIsSleepData] = useState(true);

  //平均の計算
  const total = data.reduce((sum, item) => sum + (isSleepData ? item.nebou : item.achievement), 0);
  const average = data.length ? (total / data.length).toFixed(0) : 0;

  // コメントの作成
  const getComment = (avg) => {
    if (isSleepData) {
      // 寝坊度の場合のコメント基準
      if (avg <= 10) return '素晴らしい';
      if (avg > 10 && avg < 20) return 'いいね！！';
      return '頑張ろう・・・';
    } else {
      // 達成度の場合のコメント基準
      if (avg >= 80) return '素晴らしい達成率！';
      if (avg >= 50) return 'いい調子！';
      return 'もっと頑張ろう！';
    }
  };

  const comment = getComment(average);

  //グラフの軸の設定
  const maxValue = Math.max(...data.map((item) => (isSleepData ? item.nebou : item.achievement)), 0);
  let yAxisInterval = 10;
  let yAxisMax = Math.ceil(maxValue / yAxisInterval) * yAxisInterval;
  let segments = yAxisMax / yAxisInterval;

  if (segments > 6) {
    yAxisInterval = 20;
    yAxisMax = Math.ceil(maxValue / yAxisInterval) * yAxisInterval;
    segments = yAxisMax / yAxisInterval;
  }

  const chartData = {
    labels: data.map((item) => item.day),
    datasets: [
      {
        data: data.map((item) => (isSleepData ? item.nebou : item.achievement)),
      },
    ],
  };

  const toggleChart = () => {
    setIsSleepData(!isSleepData);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{isSleepData ? '寝坊度' : '達成度'}</Text>
      <TouchableOpacity style={styles.toggleButton} onPress={toggleChart}>
        <Text style={styles.toggleButtonText}>
          {isSleepData ? '達成度に切り替え' : '寝坊度に切り替え'}
        </Text>
      </TouchableOpacity>
      <View style={styles.chartContainer}>
        <Text style={styles.periodText}>02/16~02/22</Text>
        {/* グラフの表示 */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <BarChart
            data={chartData}
            width={screenWidth - 80}
            height={180}
            yAxisSuffix={isSleepData ? '分' : '%'}
            yAxisInterval={yAxisInterval}
            fromZero
            withVerticalLabels={true}
            withHorizontalLabels={true}
            yLabelsOffset={10}
            verticalLabelRotation={0}
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
      {/* 平均とコメント */}
      <View style={styles.averageContainer}>
        <Text style={styles.averageLabel}>今週の平均</Text>
        <Text style={styles.averageValue}>
          {average}
          {isSleepData ? '分' : '%'}
        </Text>
      </View>
      <View style={styles.speechBubbleContainer}>
        <View style={styles.speechBubbleTail} />
        <View style={styles.speechBubble}>
          <Text style={styles.speechText}>{comment}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 16 },
  toggleButton: {
    backgroundColor: '#ff9999',
    padding: 10,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  toggleButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  chartContainer: {
    backgroundColor: '#ffe6e6',
    borderRadius: 16,
    padding: 10,
    marginHorizontal: 20,
    overflow: 'hidden',
    alignItems: 'center',
  },
  periodText: { textAlign: 'center', marginBottom: 10, fontSize: 20 },
  averageContainer: {
    backgroundColor: '#ffe6e6',
    borderRadius: 16,
    padding: 30,
    margin: 20,
    alignItems: 'center',
    position: 'relative',
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
  averageLabel: { fontSize: 18, marginBottom: 10 },
  averageValue: { fontSize: 36, fontWeight: 'bold' },
  speechText: { fontSize: 18, textAlign: 'center', color: '#ff3333' },
});

export default MyPageScreen;
