import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { StyleSheet, Text, View, Button } from 'react-native';
import ToDo from './todo/todo.js'

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View>
          <View style={[styles.row, {flex: 1, margin: 8}]}>
            <Text style={styles.goodMorning}>おはようございます！</Text>
          </View>
          <View style={[styles.row, {flex: 1}]}>
            <Text style={styles.lateTime}>〇〇分遅れ</Text>
          </View>
          <View style={[styles.row, {flex: 10}]}>
            <ToDo data= {[1, 2, 3, 4]} />
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
  container: {
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
  }
});
