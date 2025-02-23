import React, {useState} from 'react';
import { CheckBox } from 'react-native-elements'
import {FlatList, StyleSheet, View, Text, TextInput} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const styles = StyleSheet.create({
  container: {
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


const ToDo = (props) => {
  const [text, setText] = useState('')
  const [items, setItems] = useState(props.data)
  const [checked, setChecks] = useState(Array(props.data.length).fill(false));

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
      <View style={styles.container}>
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
  );
};

export default ToDo;

