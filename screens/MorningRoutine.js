import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Button, FlatList, TextInput } from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { CheckBox } from 'react-native-elements'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as SQLite from 'expo-sqlite';

const data = [1, 2]

export default function MorningRoutine() {
  

  const [text, setText] = useState('')
  const [items, setItems] = useState(data)
  const [checked, setChecks] = useState(Array(data.length).fill(false));
  

  const toggleCheckBox = index => {
    setChecks(prev => {
      const newChecked = [...prev];
      newChecked[index] =!newChecked[index];
      return newChecked;
    })
  }

  const createNewItem = str => {
    if(text.trim() === '') return;
    setItems([...items, str]);
    setText('');
  }


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
              <KeyboardAwareScrollView behavior="padding" style={styles.list}>
                <FlatList
                  style={styles.list}
                  data={items}
                  renderItem={({item, index}) => (
                    <View style={styles.itemBlock}>
                      <CheckBox
                        style={styles.checkbox}
                        checked={checked[index]}
                        onPress={() => toggleCheckBox(index)}
                      />
                      <Text style={styles.text}>{item}</Text>
                    </View>
                  )}
                />
                <TextInput
                    style={styles.input}
                    value={text}
                    onChangeText={setText}
                    placeholder='todoを追加'
                    onSubmitEditing={() => createNewItem(text)}
                />
              </KeyboardAwareScrollView>
            </View>
          </View>
          <View style={[styles.row, {flex: 2}]}>
            <Button title='朝活を終える' />
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
  itemBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    flexShrink: 1,
  },
  input: {
    backgroundColor: 'white',
    padding: 16,
    width: '90%',
    borderRadius: 8,
    fontSize: 16,
    margin: 16,
  }
});