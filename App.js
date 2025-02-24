import * as SQLite from 'expo-sqlite';
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "./screens/HomeScreen";
import AlarmSettingScreen from "./screens/AlarmSettingScreen";
import MyPageScreen from "./screens/MyPageScreen";
import AlarmPage1 from "./screens/AlarmPage1";
import AlarmPage2 from "./screens/AlarmPage2";
import MorningRoutine from "./screens/MorningRoutine";

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    async function insertData() {
      try {
        const db = await SQLite.openDatabaseAsync('hayaoki.db');
      
        await db.runAsync('DELETE FROM alarm_data');
        await db.runAsync('DELETE FROM progress');
       
        
        // テーブルを作成
        await db.execAsync(`
          PRAGMA journal_mode = WAL;

          -- アラーム用データのテーブルを作成
          CREATE TABLE IF NOT EXISTS alarm_data (
            id INTEGER PRIMARY KEY NOT NULL, 
            wake_up_time TEXT NOT NULL, 
            actual_wake_up_time TEXT NOT NULL, 
            activity_start_time TEXT NOT NULL, 
            time_difference TEXT NOT NULL
          );

          -- 進捗データ用テーブルを作成
          CREATE TABLE IF NOT EXISTS progress (
            id INTEGER PRIMARY KEY NOT NULL,
            date TEXT NOT NULL,
            achievement INTEGER NOT NULL
          );

          -- アラーム用データの挿入
          INSERT INTO alarm_data (wake_up_time, actual_wake_up_time, activity_start_time, time_difference) 
          VALUES 
          ('2025/02/22 06:00:00', '2025/02/22 06:05:00', '2025/02/22 06:15:00', '15');

          -- 進捗用データの挿入
          INSERT INTO progress (date, achievement) 
          VALUES 
          ('2025/02/22', 40);
        `);

        // データの取得（アラームデータ、Todoデータ、進捗データ）
        const alarmRows = await db.getAllAsync('SELECT * FROM alarm_data');
        console.log('アラーム用テーブルのデータ（初回）：', alarmRows);
/*
        const todoRows = await db.getAllAsync('SELECT * FROM todo_list');
        console.log('TODOリスト用テーブルのデータ（初回）:', todoRows);
*/
        const progressRows = await db.getAllAsync('SELECT * FROM progress');
        console.log('進捗用テーブルのデータ（初回）：', progressRows);

        if (db) {
          await db.closeAsync();
          db = null;
        }
        
      } catch (error) {
        console.log('Error:', error);
      }
    }
    insertData();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AlarmSetting" component={AlarmSettingScreen} />
        <Stack.Screen name="AlarmPage1" component={AlarmPage1} />
        <Stack.Screen name="AlarmPage2" component={AlarmPage2} />
        <Stack.Screen name="MorningRoutine" component={MorningRoutine} />
        <Stack.Screen name="MyPage" component={MyPageScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

//データの追加
// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';
// import * as SQLite from 'expo-sqlite';
// import { useEffect } from 'react';

// export default function App() {
//   useEffect(() => {
//     async function insertData() {
//       try {
//         // データベースのオープン
//         const db = await SQLite.openDatabaseAsync('hayaoki.db');

//         // テーブル作成
//         await db.execAsync(`
//           PRAGMA journal_mode = WAL;

//           -- アラーム用データのテーブルを作成
//           CREATE TABLE IF NOT EXISTS alarm_data (
//             id INTEGER PRIMARY KEY NOT NULL,
//             wake_up_time TEXT NOT NULL,
//             actual_wake_up_time TEXT NOT NULL,
//             activity_start_time TEXT NOT NULL,
//             time_difference TEXT NOT NULL
//           );

//           -- Todoリスト用データのテーブルを作成
//           CREATE TABLE IF NOT EXISTS todo_list (
//             id INTEGER PRIMARY KEY NOT NULL,
//             task TEXT NOT NULL,
//             completed BOOLEAN NOT NULL
//           );

//           -- 進捗データ用テーブルを作成
//           CREATE TABLE IF NOT EXISTS progress (
//             id INTEGER PRIMARY KEY NOT NULL,
//             date TEXT NOT NULL,
//             achievement INTEGER NOT NULL
//           );
//         `);

//         // ランダムな正の整数（1～100）を生成
//         const randomTimeDiff1 = Math.floor(Math.random() * 100) + 1;
//         const randomTimeDiff2 = Math.floor(Math.random() * 100) + 1;
//         const randomTimeDiff3 = Math.floor(Math.random() * 100) + 1;

//         await db.execAsync(`
//           INSERT INTO progress (date, achievement)
//           VALUES
//           ('2025/02/18', ${randomTimeDiff1}),
//           ('2025/02/19', ${randomTimeDiff2}),
//           ('2025/02/20', ${randomTimeDiff3}),
//           ('2025/02/21', ${randomTimeDiff1}),
//           ('2025/02/22', ${randomTimeDiff2}),
//           ('2025/02/23', ${randomTimeDiff3});
//         `);

//         // 挿入したデータの取得とログ出力
//         const alarmRows = await db.getAllAsync('SELECT * FROM alarm_data');
//         console.log('アラーム用テーブルのデータ：', alarmRows);

//         const todoRows = await db.getAllAsync('SELECT * FROM todo_list');
//         console.log('TODOリスト用テーブルのデータ:', todoRows);

//         const progressRows = await db.getAllAsync('SELECT * FROM progress');
//         console.log('進捗用テーブルのデータ：', progressRows);
       
//       } catch (error) {
//         console.log('Error:', error);
//       }
//     }
//     insertData();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//       <StatusBar style="auto" />
//       <Text>Welcome to Hayaoki!</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
