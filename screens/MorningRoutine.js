import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity, Alert } from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { CheckBox } from 'react-native-elements'
import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SwipeListView } from 'react-native-swipe-list-view';


export default function MorningRoutine({ navigation, route }) {
  const [text, setText] = useState('');
  const [items, setItems] = useState([]);


  const insertItem = (str) => {
    setItems(prev => {
      const newArray = [...prev, {task: str, checked: false}];
      return newArray;
    });
  };

  const toggleCheckBox = index => {
    setItems(prev => {
      const newArray = [...prev];
      newArray[index].checked =!newArray[index].checked;
      return newArray;
    });
  };

  const createNewItem = str => {
    if(str.trim() === '') return;
    insertItem(str);
    setText('');
  }

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
    setItems(prev => {
      const newArray = [...prev];
      return newArray.filter(obj => obj.task !== rowKey);
    });
  };

  const saveRecord = () => {
    const taskNum = items.length;
    let achievedNum = 0;
    const listForSave = [];
    for(let i = 0; i < taskNum; i++) {
      if(items[i].checked) achievedNum++;
      listForSave.push(items[i].task);
    }
    const achievement = 100*(achievedNum/taskNum);
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const date = String(today.getDate()).padStart(2, '0');

    const saveList = async () => {
      try {
        const jsonList = JSON.stringify(listForSave);
        await AsyncStorage.removeItem('todoList');
        await AsyncStorage.setItem('todoList', jsonList);
      } catch(error) {
        console.log('AsyncStorageに挿入するときのエラー', error);
      }
    }

    const saveAchievement = async () => {
      try {
        const db = await SQLite.openDatabaseAsync('hayaoki.db'); //ファイル名検討
        await db.runAsync('INSERT INTO progress (date, achievement) values (?, ?)', `${year}/${month}/${date}`, Math.floor(achievement));
        const a = await db.getAllAsync('SELECT * FROM progress');
      } catch(error) {
        console.log('データ挿入のエラー', error);
      }
    }


    Alert.alert(
          "確認",
          `達成率は${Math.floor(achievement)}%です。朝活を終了しますか？`,
          [
            { text: "キャンセル", style: "cancel" },
            { text: "OK", onPress: () => {
              saveList();
              saveAchievement();
              navigation.navigate("MyPage");
            }},
          ]
        )
  }

  useEffect(() => {
    const getPrevList = async () => {
      try {
        const prevList = await AsyncStorage.getItem('todoList');
        if(prevList !== null) { 
          const arrList = JSON.parse(prevList);
          if(arrList) {
            for(let i = 0; i < arrList.length; i++) {
              insertItem(arrList[i]);
            }
          }
        }
      } catch(error) {
        console.error("テーブル取得または作成に失敗:", error);
      }
    };

    getPrevList();
  }, [])

  
  return (
   <SafeAreaProvider>
      <SafeAreaView style={styles.containerWhole}>
        <View>
          <View style={[styles.row, {flex: 1, margin: 8}]}>
            <Text style={styles.goodMorning}>おはようございます！</Text>
          </View>
          <View style={[styles.row, {flex: 1}]}>
            <Text style={styles.lateTime}>〇〇分遅れ</Text>
          </View>
          <View style={[styles.row, {flex: 10}]}>
            <View style={styles.containerTodo}>
              <Text style={styles.title}>今日の朝活ToDo</Text>
                <TextInput
                    style={styles.input}
                    value={text}
                    onChangeText={setText}
                    placeholder='todoを追加'
                    onSubmitEditing={() => createNewItem(text)}
                />
                <SwipeListView
                  disableRightSwipe
                  rightOpenValue={-65}
                  style={styles.list}
                  keyExtractor={(item, index) => item.task}
                  data={items}
                  renderItem={({item, index}) => (
                    <View style={styles.frontBlock}>
                      <CheckBox
                        style={styles.checkbox}
                        checked={item.checked}
                        onPress={() => toggleCheckBox(index)}
                      />
                      <Text style={styles.item}>{item.task}</Text>
                    </View>
                  )}
                  renderHiddenItem={(data, rowMap) => (
                    <View style={styles.backBlock}>
                      <TouchableOpacity 
                        style={styles.delBtn}
                        onPress={() => {closeRow(rowMap, data.item.task)}}
                      >
                        <Text style={styles.delText}>削除</Text>
                      </TouchableOpacity>
                    </View> 
                  )}
               
                />
            </View>
          </View>
          <View style={[styles.row, {flex: 2, padding: 24}]}>
            <Button title="朝活を終える" onPress={() => {saveRecord()} }/>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  containerWhole: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  goodMorning: {
    fontSize: 36,
  },
  lateTime: {
    fontSize: 24,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
  },
  containerTodo: {
    flex: 1,
    backgroundColor: 'pink',
    borderRadius: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    padding: 16,
  },
  list: {
    width: '95%',
    margin: 16,
  },
  frontBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'pink',
    borderBottomColor: 'black',
    borderBottomWidth: 0.3,
    height: 50,
  },
  item: {
    fontSize: 20,
    flexShrink: 1,
  },
  backBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'red',
    flex: 1,
  },
  delBtn: {
    flex: 1,
  },
  delText: {
    marginLeft: 'auto',
    padding: 16,
    fontSize: 16,
    color: 'white',
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    width: '90%',
    borderRadius: 8,
    fontSize: 16,
  }
});