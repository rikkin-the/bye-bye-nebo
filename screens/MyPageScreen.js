import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import * as SQLite from 'expo-sqlite';
import { useEffect } from 'react';

const screenWidth = Dimensions.get('window').width;

const testData = [
  { day: '日', value: 34 },
  { day: '月', value: 0 },
  { day: '火', value: 26 },
  { day: '水', value: 0 },
  { day: '木', value: 17 },
  { day: '金', value: 0 },
  { day: '土', value: 0 },
];

const MyPageScreen = () => {
  const [data, setData] = useState(testData);
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const average = (total / data.length).toFixed(0);

  //コメントの追加
  const getComment = (avg) => {
    if (avg <= 10) return '素晴らしい';
    if (avg > 10 && avg < 20) return 'いいね！！';
    return '頑張ろう・・・';
  };

  const comment = getComment(average);

  //最大値の設定（y軸）
  const maxValue = Math.max(...data.map((item) => item.value));
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
        data: data.map((item) => item.value),
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>寝坊度</Text>
      <View style={styles.chartContainer}>
        <Text style={styles.periodText}>02/16~02/22</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {/* グラフの作成 */}
          <BarChart
            data={chartData}
            width={screenWidth - 80}
            height={180}
            yAxisSuffix="分"
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
      {/* 平均の表示とコメント */}
      <View style={styles.averageContainer}>
        <Text style={styles.averageLabel}>今週の平均</Text>
        <Text style={styles.averageValue}>{average}分</Text>
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
    marginTop: -20,
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
